-- Run this in the Supabase SQL Editor to set up the Game Hub

-- Room lifecycle
create table if not exists rooms (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  game_type  text not null,
  status     text not null default 'waiting',
  player1_id text,
  player2_id text,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '2 hours'
);

-- Real-time game state
create table if not exists game_states (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid references rooms(id) on delete cascade,
  board        jsonb not null,
  current_turn text not null,
  move_count   int not null default 0,
  winner       text,
  updated_at   timestamptz default now()
);

-- Persistent leaderboard
create table if not exists leaderboard (
  id         uuid primary key default gen_random_uuid(),
  nickname   text not null,
  game_type  text not null,
  wins       int not null default 0,
  losses     int not null default 0,
  draws      int not null default 0,
  updated_at timestamptz default now(),
  unique (nickname, game_type)
);

-- Enable Row Level Security
alter table rooms       enable row level security;
alter table game_states enable row level security;
alter table leaderboard enable row level security;

-- Permissive policies (MVP — open to all anon users)
create policy "Allow all on rooms"       on rooms       for all using (true) with check (true);
create policy "Allow all on game_states" on game_states for all using (true) with check (true);
create policy "Allow all on leaderboard" on leaderboard for all using (true) with check (true);

-- Helper function for atomic leaderboard increments
create or replace function increment_leaderboard(
  p_nickname  text,
  p_game_type text,
  p_field     text
) returns void language plpgsql as $$
begin
  insert into leaderboard (nickname, game_type, wins, losses, draws)
  values (p_nickname, p_game_type, 0, 0, 0)
  on conflict (nickname, game_type) do nothing;

  if p_field = 'wins' then
    update leaderboard set wins   = wins   + 1, updated_at = now()
    where nickname = p_nickname and game_type = p_game_type;
  elsif p_field = 'losses' then
    update leaderboard set losses = losses + 1, updated_at = now()
    where nickname = p_nickname and game_type = p_game_type;
  elsif p_field = 'draws' then
    update leaderboard set draws  = draws  + 1, updated_at = now()
    where nickname = p_nickname and game_type = p_game_type;
  end if;
end;
$$;

-- Enable Realtime for game_states and rooms
-- (Do this in the Supabase Dashboard: Table Editor → Toggle Realtime for each table)
-- Or via SQL:
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table game_states;
alter publication supabase_realtime add table rooms;

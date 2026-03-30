export type GameType = 'tictactoe' | 'connect4'
export type RoomStatus = 'waiting' | 'active' | 'finished'

export interface Room {
  id: string
  code: string
  game_type: GameType
  status: RoomStatus
  player1_id: string | null
  player2_id: string | null
  created_at: string
  expires_at: string
}

export interface GameState {
  id: string
  room_id: string
  board: unknown
  current_turn: string
  move_count: number
  winner: string | null
  updated_at: string
}

export interface LeaderboardEntry {
  id: string
  nickname: string
  game_type: GameType
  wins: number
  losses: number
  draws: number
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: Room
        Insert: Partial<Room>
        Update: Partial<Room>
      }
      game_states: {
        Row: GameState
        Insert: Partial<GameState>
        Update: Partial<GameState>
      }
      leaderboard: {
        Row: LeaderboardEntry
        Insert: Partial<LeaderboardEntry>
        Update: Partial<LeaderboardEntry>
      }
    }
  }
}

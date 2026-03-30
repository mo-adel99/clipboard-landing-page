import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry, GameType } from '../types/database'

async function incrementField(nickname: string, gameType: GameType, field: 'wins' | 'losses' | 'draws') {
  const { error } = await supabase.rpc('increment_leaderboard', {
    p_nickname: nickname,
    p_game_type: gameType,
    p_field: field,
  })
  if (error) {
    // Fallback: upsert without atomic increment
    await supabase
      .from('leaderboard')
      .upsert(
        { nickname, game_type: gameType, wins: 0, losses: 0, draws: 0, [field]: 1 },
        { onConflict: 'nickname,game_type' }
      )
  }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  const fetchLeaderboard = useCallback(async (gameType: GameType) => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('game_type', gameType)
      .order('wins', { ascending: false })
      .limit(10)
    if (data) setEntries(data as LeaderboardEntry[])
  }, [])

  const recordResult = useCallback(async (
    winner: string,
    loser: string,
    gameType: GameType,
    isDraw: boolean,
    isPlayer1: boolean,
  ) => {
    // Only player1 writes to prevent double-writes
    if (!isPlayer1) return

    if (isDraw) {
      await Promise.all([winner, loser].map(nickname => incrementField(nickname, gameType, 'draws')))
    } else {
      await incrementField(winner, gameType, 'wins')
      await incrementField(loser, gameType, 'losses')
    }
  }, [])

  return { entries, fetchLeaderboard, recordResult }
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Room, GameType } from '../types/database'

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function useRoom(roomCode?: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoom = useCallback(async (code: string) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code)
      .single()
    if (error) return null
    return data as Room
  }, [])

  useEffect(() => {
    if (!roomCode) return

    // Initial fetch
    fetchRoom(roomCode).then(r => {
      if (r) setRoom(r)
    })

    // Subscribe to updates
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode}` },
        payload => setRoom(payload.new as Room)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomCode, fetchRoom])

  const createRoom = useCallback(async (nickname: string, gameType: GameType): Promise<Room | null> => {
    setLoading(true)
    setError(null)
    try {
      // Try up to 3 codes in case of collision
      for (let attempt = 0; attempt < 3; attempt++) {
        const code = generateRoomCode()
        const { data, error: insertError } = await supabase
          .from('rooms')
          .insert({ code, game_type: gameType, player1_id: nickname, status: 'waiting' })
          .select()
          .single()
        if (!insertError && data) {
          const newRoom = data as Room
          setRoom(newRoom)
          return newRoom
        }
      }
      setError('Failed to create room. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const joinRoom = useCallback(async (code: string, nickname: string): Promise<Room | null> => {
    setLoading(true)
    setError(null)
    try {
      const existing = await fetchRoom(code.toUpperCase())
      if (!existing) {
        setError('Room not found. Check the code and try again.')
        return null
      }
      if (existing.status !== 'waiting') {
        setError('This game is already in progress or has ended.')
        return null
      }
      if (new Date(existing.expires_at) < new Date()) {
        setError('This room has expired.')
        return null
      }
      const { data, error: updateError } = await supabase
        .from('rooms')
        .update({ player2_id: nickname, status: 'active' })
        .eq('code', code.toUpperCase())
        .select()
        .single()
      if (updateError || !data) {
        setError('Failed to join room.')
        return null
      }
      const joined = data as Room
      setRoom(joined)
      return joined
    } finally {
      setLoading(false)
    }
  }, [fetchRoom])

  return { room, loading, error, createRoom, joinRoom }
}

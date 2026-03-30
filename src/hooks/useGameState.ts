import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { playSound } from '../lib/sounds'
import type { GameState } from '../types/database'
import type { GamePlugin } from '../types/game'

interface UseGameStateOptions {
  roomId: string
  myNickname: string
  player1Nickname: string
  plugin: GamePlugin
  onWinner?: (winner: string) => void
}

export function useGameState({
  roomId,
  myNickname,
  player1Nickname,
  plugin,
  onWinner,
}: UseGameStateOptions) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [board, setBoard] = useState<unknown>(plugin.initialBoard())
  const [currentTurn, setCurrentTurn] = useState<string>(player1Nickname)
  const [winner, setWinner] = useState<string | null>(null)
  const winnerCalled = useRef(false)

  // Initialize or fetch game state
  useEffect(() => {
    async function init() {
      const { data: existing } = await supabase
        .from('game_states')
        .select('*')
        .eq('room_id', roomId)
        .maybeSingle()

      if (existing) {
        const gs = existing as GameState
        setGameState(gs)
        setBoard(gs.board)
        setCurrentTurn(gs.current_turn)
        if (gs.winner) setWinner(gs.winner)
      } else if (myNickname === player1Nickname) {
        const initBoard = plugin.initialBoard()
        const { data } = await supabase
          .from('game_states')
          .insert({
            room_id: roomId,
            board: initBoard,
            current_turn: player1Nickname,
            move_count: 0,
            winner: null,
          })
          .select()
          .maybeSingle()
        if (data) setGameState(data as GameState)
      }
    }
    init()
  }, [roomId, myNickname, player1Nickname, plugin])

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`game_state:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_states', filter: `room_id=eq.${roomId}` },
        payload => {
          const gs = payload.new as GameState
          setGameState(gs)
          setBoard(gs.board)
          setCurrentTurn(gs.current_turn)
          if (gs.winner && !winnerCalled.current) {
            setWinner(gs.winner)
          }
          playSound('move')
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  // Trigger onWinner callback
  useEffect(() => {
    if (winner && !winnerCalled.current) {
      winnerCalled.current = true
      if (winner === myNickname) {
        playSound('win')
      } else if (winner !== 'draw') {
        playSound('loss')
      }
      onWinner?.(winner)
    }
  }, [winner, myNickname, onWinner])

  const makeMove = useCallback(async (move: unknown) => {
    if (!gameState || winner) return
    if (currentTurn !== myNickname) return

    const newBoard = plugin.applyMove(board, move, myNickname)
    const newWinner = plugin.checkWinner(newBoard)

    // Optimistic update
    setBoard(newBoard)
    if (newWinner) setWinner(newWinner)

    // Get player2 from room to determine next turn
    const { data: roomData } = await supabase
      .from('rooms')
      .select('player1_id, player2_id')
      .eq('id', roomId)
      .maybeSingle()

    if (!roomData) return

    const p1 = roomData.player1_id as string
    const p2 = roomData.player2_id as string
    const nextTurn = currentTurn === p1 ? p2 : p1

    await supabase
      .from('game_states')
      .update({
        board: newBoard,
        current_turn: newWinner ? currentTurn : nextTurn,
        move_count: (gameState.move_count ?? 0) + 1,
        winner: newWinner ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('room_id', roomId)
  }, [gameState, winner, currentTurn, myNickname, board, plugin, roomId])

  const isMyTurn = currentTurn === myNickname && !winner

  return { board, currentTurn, winner, isMyTurn, makeMove, updatedAt: gameState?.updated_at }
}

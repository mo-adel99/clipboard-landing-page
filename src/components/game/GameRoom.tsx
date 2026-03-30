import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useGameState } from '../../hooks/useGameState'
import { useTurnTimer } from '../../hooks/useTurnTimer'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { GameStatusBar } from './GameStatusBar'
import { GameOverModal } from './GameOverModal'
import type { Room } from '../../types/database'
import type { GamePlugin } from '../../types/game'
import './game-room.css'

interface GameRoomProps {
  room: Room
  myNickname: string
  plugin: GamePlugin
}

export function GameRoom({ room, myNickname, plugin }: GameRoomProps) {
  const navigate = useNavigate()
  const player1Nickname = room.player1_id!
  const player2Nickname = room.player2_id!

  const { entries, fetchLeaderboard, recordResult } = useLeaderboard()

  const onWinner = useCallback(async (winner: string) => {
    const isDraw = winner === 'draw'
    const otherPlayer = myNickname === player1Nickname ? player2Nickname : player1Nickname
    await recordResult(
      isDraw ? myNickname : winner,
      isDraw ? otherPlayer : (winner === myNickname ? otherPlayer : myNickname),
      room.game_type,
      isDraw,
      myNickname === player1Nickname,
    )
    await fetchLeaderboard(room.game_type)
  }, [myNickname, player1Nickname, player2Nickname, room.game_type, recordResult, fetchLeaderboard])

  const { board, currentTurn, winner, isMyTurn, makeMove, updatedAt } = useGameState({
    roomId: room.id,
    myNickname,
    player1Nickname,
    plugin,
    onWinner,
  })

  const handleTimeout = useCallback(() => {
    const otherPlayer = currentTurn === player1Nickname ? player2Nickname : player1Nickname
    supabase
      .from('game_states')
      .update({ winner: otherPlayer, updated_at: new Date().toISOString() })
      .eq('room_id', room.id)
  }, [currentTurn, player1Nickname, player2Nickname, room.id])

  const { secondsLeft, progress, isUrgent } = useTurnTimer({
    isMyTurn,
    winner,
    updatedAt,
    onTimeout: handleTimeout,
  })

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard(room.game_type)
  }, [fetchLeaderboard, room.game_type])

  const BoardComponent = plugin.BoardComponent

  return (
    <div className="game-room">
      <GameStatusBar
        player1Nickname={player1Nickname}
        player2Nickname={player2Nickname}
        currentTurn={currentTurn}
        myNickname={myNickname}
        secondsLeft={secondsLeft}
        progress={progress}
        isUrgent={isUrgent}
        winner={winner}
      />

      <div className="game-room__board">
        <BoardComponent
          board={board}
          onMove={makeMove}
          currentTurn={currentTurn}
          myNickname={myNickname}
          player1Nickname={player1Nickname}
          player2Nickname={player2Nickname}
          disabled={!isMyTurn || !!winner}
        />
      </div>

      <GameOverModal
        open={!!winner}
        winner={winner}
        myNickname={myNickname}
        player1Nickname={player1Nickname}
        player2Nickname={player2Nickname}
        leaderboard={entries}
        gameDisplayName={plugin.displayName}
        onPlayAgain={() => navigate('/')}
        onHome={() => navigate('/')}
      />
    </div>
  )
}

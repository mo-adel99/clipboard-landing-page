import { CountdownRing } from '../ui/CountdownRing'
import './game-status-bar.css'

interface GameStatusBarProps {
  player1Nickname: string
  player2Nickname: string
  currentTurn: string
  myNickname: string
  secondsLeft: number
  progress: number
  isUrgent: boolean
  winner: string | null
}

export function GameStatusBar({
  player1Nickname,
  player2Nickname,
  currentTurn,
  myNickname,
  secondsLeft,
  progress,
  isUrgent,
  winner,
}: GameStatusBarProps) {
  function PlayerTag({ nickname }: { nickname: string }) {
    const isActive = !winner && currentTurn === nickname
    const isMe = nickname === myNickname
    const isP1 = nickname === player1Nickname
    return (
      <div className={`player-tag ${isActive ? 'player-tag--active' : ''} ${isP1 ? 'player-tag--p1' : 'player-tag--p2'}`}>
        <span className="player-tag__symbol">{isP1 ? '✕' : '○'}</span>
        <span className="player-tag__name">{nickname}{isMe ? ' (you)' : ''}</span>
        {isActive && <span className="player-tag__dot" />}
      </div>
    )
  }

  return (
    <div className="status-bar">
      <PlayerTag nickname={player1Nickname} />
      <div className="status-bar__center">
        {!winner && (
          <CountdownRing
            secondsLeft={secondsLeft}
            progress={progress}
            isUrgent={isUrgent}
            isMyTurn={currentTurn === myNickname}
          />
        )}
        {winner && (
          <span className="status-bar__result">
            {winner === 'draw' ? '🤝 Draw!' : `🏆 ${winner} wins!`}
          </span>
        )}
      </div>
      <PlayerTag nickname={player2Nickname} />
    </div>
  )
}

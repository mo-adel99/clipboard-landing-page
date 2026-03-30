import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { LeaderboardEntry } from '../../types/database'
import './game-over-modal.css'

interface GameOverModalProps {
  open: boolean
  winner: string | null
  myNickname: string
  player1Nickname: string
  player2Nickname: string
  leaderboard: LeaderboardEntry[]
  gameDisplayName: string
  onPlayAgain: () => void
  onHome: () => void
}

export function GameOverModal({
  open,
  winner,
  myNickname,
  leaderboard,
  gameDisplayName,
  onPlayAgain,
  onHome,
}: GameOverModalProps) {
  const isWinner = winner === myNickname
  const isDraw = winner === 'draw'

  return (
    <Modal open={open}>
      <div className="game-over">
        <div className="game-over__emoji">
          {isDraw ? '🤝' : isWinner ? '🏆' : '😔'}
        </div>
        <h2 className="game-over__title">
          {isDraw ? "It's a draw!" : isWinner ? 'You won!' : `${winner} won!`}
        </h2>

        {leaderboard.length > 0 && (
          <div className="game-over__leaderboard">
            <p className="game-over__lb-title">{gameDisplayName} Standings</p>
            <table className="lb-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>W</th>
                  <th>L</th>
                  <th>D</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(e => (
                  <tr key={e.id} className={e.nickname === myNickname ? 'lb-table__me' : ''}>
                    <td>{e.nickname}</td>
                    <td>{e.wins}</td>
                    <td>{e.losses}</td>
                    <td>{e.draws}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="game-over__actions">
          <Button onClick={onPlayAgain} size="lg">Play Again</Button>
          <Button variant="secondary" onClick={onHome}>Home</Button>
        </div>
      </div>
    </Modal>
  )
}

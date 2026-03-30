import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { GameRoom } from '../components/game/GameRoom'
import { GAME_REGISTRY } from '../components/games'
import './game-page.css'

export function GamePage() {
  const { code } = useParams<{ code: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const nickname = (location.state as { nickname?: string })?.nickname ?? ''
  const { room } = useRoom(code)

  if (!nickname) {
    navigate('/')
    return null
  }

  if (!room) {
    return (
      <div className="game-page-loading">
        <span className="game-spinner" />
        Setting up the game…
      </div>
    )
  }

  if (room.status === 'waiting') {
    return (
      <div className="game-page-loading">
        Waiting for the second player…
      </div>
    )
  }

  const plugin = GAME_REGISTRY[room.game_type]
  if (!plugin) return <div className="game-page-loading">Unknown game type.</div>

  return (
    <div className="game-page">
      <header className="game-page__header">
        <button className="game-page__back" onClick={() => navigate('/')}>← Home</button>
        <span className="game-page__title">{plugin.emoji} {plugin.displayName}</span>
        <span />
      </header>
      <GameRoom room={room} myNickname={nickname} plugin={plugin} />
    </div>
  )
}

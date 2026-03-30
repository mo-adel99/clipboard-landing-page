import { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { WaitingRoom } from '../components/lobby/WaitingRoom'
import { GAME_REGISTRY } from '../components/games'
import './lobby-page.css'

export function LobbyPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const nickname = (location.state as { nickname?: string })?.nickname ?? ''
  const { room } = useRoom(code)

  useEffect(() => {
    if (room?.status === 'active') {
      navigate(`/game/${code}`, { state: { nickname } })
    }
  }, [room, code, navigate, nickname])

  if (!room) {
    return <div className="lobby-loading"><span className="lobby-spinner" />Loading…</div>
  }

  const plugin = GAME_REGISTRY[room.game_type]

  return (
    <div className="lobby-page">
      <WaitingRoom
        roomCode={code!}
        gameDisplayName={plugin?.displayName ?? room.game_type}
        gameEmoji={plugin?.emoji ?? '🎮'}
        nickname={nickname}
      />
    </div>
  )
}

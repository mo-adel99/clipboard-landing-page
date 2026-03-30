import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { AVAILABLE_GAMES } from '../components/games'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import type { GameType } from '../types/database'
import './home-page.css'

interface HomePageProps {
  nickname: string
  setNickname: (n: string) => void
}

type Mode = 'menu' | 'create' | 'join'

export function HomePage({ nickname, setNickname }: HomePageProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('menu')
  const [nickInput, setNickInput] = useState(nickname)
  const [joinCode, setJoinCode] = useState('')
  const [selectedGame, setSelectedGame] = useState<GameType>('tictactoe')
  const { createRoom, joinRoom, loading, error } = useRoom()

  const isNickValid = nickInput.trim().length >= 2

  async function handleCreate() {
    if (!isNickValid) return
    const nick = nickInput.trim()
    setNickname(nick)
    const room = await createRoom(nick, selectedGame)
    if (room) navigate(`/lobby/${room.code}`, { state: { nickname: nick } })
  }

  async function handleJoin() {
    if (!isNickValid || joinCode.length !== 6) return
    const nick = nickInput.trim()
    setNickname(nick)
    const room = await joinRoom(joinCode.toUpperCase(), nick)
    if (room) navigate(`/game/${room.code}`, { state: { nickname: nick } })
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">🎮 Game Hub</h1>
        <p className="home-sub">Just the two of us</p>
      </header>

      <div className="home-card">
        <Input
          id="nickname"
          label="Your nickname"
          value={nickInput}
          onChange={e => setNickInput(e.target.value)}
          placeholder="e.g. Babe"
          maxLength={16}
          autoComplete="off"
        />

        {mode === 'menu' && (
          <div className="home-actions">
            <Button size="lg" onClick={() => setMode('create')} disabled={!isNickValid}>
              Create Room
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setMode('join')} disabled={!isNickValid}>
              Join Room
            </Button>
          </div>
        )}

        {mode === 'create' && (
          <div className="home-form">
            <p className="home-form__label">Pick a game:</p>
            <div className="game-picker">
              {AVAILABLE_GAMES.map(game => (
                <button
                  key={game.id}
                  className={`game-pick-btn ${selectedGame === game.id ? 'game-pick-btn--selected' : ''}`}
                  onClick={() => setSelectedGame(game.id as GameType)}
                >
                  <span className="game-pick-btn__emoji">{game.emoji}</span>
                  <span className="game-pick-btn__name">{game.displayName}</span>
                  <span className="game-pick-btn__desc">{game.description}</span>
                </button>
              ))}
            </div>
            {error && <p className="form-error">{error}</p>}
            <div className="home-actions">
              <Button size="lg" onClick={handleCreate} disabled={loading || !isNickValid}>
                {loading ? 'Creating…' : 'Create Room'}
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setMode('menu')}>Back</Button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="home-form">
            <Input
              id="join-code"
              label="Room code"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="XXXXXX"
              maxLength={6}
              autoComplete="off"
              style={{ letterSpacing: '0.2em', fontSize: '1.3rem', textAlign: 'center' }}
            />
            {error && <p className="form-error">{error}</p>}
            <div className="home-actions">
              <Button size="lg" onClick={handleJoin} disabled={loading || !isNickValid || joinCode.length !== 6}>
                {loading ? 'Joining…' : 'Join Game'}
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setMode('menu')}>Back</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

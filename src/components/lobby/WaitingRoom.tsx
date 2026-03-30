import { useState } from 'react'
import { Button } from '../ui/Button'
import './waiting-room.css'

interface WaitingRoomProps {
  roomCode: string
  gameDisplayName: string
  gameEmoji: string
  nickname: string
}

export function WaitingRoom({ roomCode, gameDisplayName, gameEmoji, nickname }: WaitingRoomProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="waiting-room">
      <div className="waiting-room__game-badge">
        <span>{gameEmoji}</span>
        <span>{gameDisplayName}</span>
      </div>
      <h2 className="waiting-room__title">Waiting for your partner…</h2>
      <p className="waiting-room__sub">Share this code with them:</p>

      <div className="waiting-room__code">{roomCode}</div>

      <Button variant="secondary" onClick={copyCode}>
        {copied ? '✓ Copied!' : 'Copy Code'}
      </Button>

      <div className="waiting-room__spinner" aria-label="Waiting..." />

      <p className="waiting-room__nick">You are: <strong>{nickname}</strong> (✕)</p>
    </div>
  )
}

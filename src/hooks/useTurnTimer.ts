import { useState, useEffect, useRef, useCallback } from 'react'

const TURN_DURATION = 30

interface UseTurnTimerOptions {
  isMyTurn: boolean
  winner: string | null
  updatedAt?: string
  onTimeout: () => void
}

export function useTurnTimer({ isMyTurn, winner, updatedAt, onTimeout }: UseTurnTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(TURN_DURATION)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  const getSecondsLeft = useCallback(() => {
    if (!updatedAt) return TURN_DURATION
    const elapsed = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 1000)
    return Math.max(0, TURN_DURATION - elapsed)
  }, [updatedAt])

  // Reset and start timer when updatedAt changes (new move made)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (winner) {
      setSecondsLeft(TURN_DURATION)
      return
    }

    setSecondsLeft(getSecondsLeft())

    intervalRef.current = setInterval(() => {
      const left = getSecondsLeft()
      setSecondsLeft(left)
      if (left <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (isMyTurn) onTimeoutRef.current()
      }
    }, 500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [updatedAt, winner, getSecondsLeft, isMyTurn])

  // Correct for tab backgrounding
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        setSecondsLeft(getSecondsLeft())
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [getSecondsLeft])

  const progress = secondsLeft / TURN_DURATION
  const isUrgent = secondsLeft <= 10

  return { secondsLeft, progress, isUrgent }
}

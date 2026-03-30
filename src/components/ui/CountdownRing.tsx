import './countdown-ring.css'

interface CountdownRingProps {
  secondsLeft: number
  progress: number // 1 = full, 0 = empty
  isUrgent: boolean
  isMyTurn: boolean
}

const SIZE = 64
const STROKE = 5
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

export function CountdownRing({ secondsLeft, progress, isUrgent, isMyTurn }: CountdownRingProps) {
  const offset = CIRCUMFERENCE * (1 - progress)
  const color = !isMyTurn ? 'var(--text-muted)' : isUrgent ? 'var(--timer-urgent)' : 'var(--timer-normal)'

  return (
    <div className={`countdown-ring ${isUrgent && isMyTurn ? 'countdown-ring--urgent' : ''}`}>
      <svg width={SIZE} height={SIZE}>
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s linear, stroke 0.3s' }}
        />
      </svg>
      <span className="countdown-ring__label" style={{ color }}>{secondsLeft}</span>
    </div>
  )
}

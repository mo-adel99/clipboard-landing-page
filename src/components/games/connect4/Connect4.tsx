import { COLS, isColumnFull } from './logic'
import type { Connect4Board } from './logic'
import type { BoardProps } from '../../../types/game'
import './connect4.css'

export function Connect4({
  board,
  onMove,
  disabled,
  player1Nickname,
}: BoardProps<Connect4Board, number>) {
  function getDisc(cell: string | null) {
    if (!cell) return null
    return cell === player1Nickname ? 'disc--p1' : 'disc--p2'
  }

  return (
    <div className="c4-wrapper">
      {/* Column click targets */}
      <div className="c4-columns">
        {Array.from({ length: COLS }, (_, col) => (
          <button
            key={col}
            className="c4-col-btn"
            onClick={() => !disabled && !isColumnFull(board, col) && onMove(col)}
            disabled={disabled || isColumnFull(board, col)}
            aria-label={`Drop in column ${col + 1}`}
          >
            <span className="c4-drop-arrow">▼</span>
          </button>
        ))}
      </div>

      {/* Board grid */}
      <div className="c4-board">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="c4-cell">
              {cell && <div className={`c4-disc ${getDisc(cell)}`} />}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { getWinningLine } from './logic'
import type { TicTacToeBoard } from './logic'
import type { BoardProps } from '../../../types/game'
import './tictactoe.css'

export function TicTacToe({
  board,
  onMove,
  disabled,
  player1Nickname,
}: BoardProps<TicTacToeBoard, number>) {
  const winLine = getWinningLine(board)

  function getSymbol(cell: string | null) {
    if (!cell) return null
    return cell === player1Nickname ? '✕' : '○'
  }

  function getCellClass(cell: string | null, index: number) {
    const classes = ['ttt-cell']
    if (cell) {
      classes.push(cell === player1Nickname ? 'ttt-cell--x' : 'ttt-cell--o')
    }
    if (winLine?.includes(index)) classes.push('ttt-cell--winning')
    return classes.join(' ')
  }

  return (
    <div className="ttt-board">
      {board.map((cell, i) => (
        <button
          key={i}
          className={getCellClass(cell, i)}
          onClick={() => !disabled && !cell && onMove(i)}
          disabled={disabled || !!cell}
          aria-label={`Cell ${i + 1}${cell ? `, ${getSymbol(cell)}` : ''}`}
        >
          {cell && <span className="ttt-symbol">{getSymbol(cell)}</span>}
        </button>
      ))}
    </div>
  )
}

export const ROWS = 6
export const COLS = 7

export type Connect4Board = (string | null)[][]

export function initialBoard(): Connect4Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

export function applyMove(board: Connect4Board, col: number, player: string): Connect4Board {
  const next = board.map(row => [...row])
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r][col] === null) {
      next[r][col] = player
      return next
    }
  }
  return board // column full, no-op
}

export function checkWinner(board: Connect4Board): string | 'draw' | null {
  // Check horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c]
      if (cell && cell === board[r][c+1] && cell === board[r][c+2] && cell === board[r][c+3]) {
        return cell
      }
    }
  }
  // Check vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c]
      if (cell && cell === board[r+1][c] && cell === board[r+2][c] && cell === board[r+3][c]) {
        return cell
      }
    }
  }
  // Check diagonal (down-right)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const cell = board[r][c]
      if (cell && cell === board[r+1][c+1] && cell === board[r+2][c+2] && cell === board[r+3][c+3]) {
        return cell
      }
    }
  }
  // Check diagonal (down-left)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      const cell = board[r][c]
      if (cell && cell === board[r+1][c-1] && cell === board[r+2][c-2] && cell === board[r+3][c-3]) {
        return cell
      }
    }
  }
  if (isBoardFull(board)) return 'draw'
  return null
}

export function isBoardFull(board: Connect4Board): boolean {
  return board[0].every(cell => cell !== null)
}

export function isColumnFull(board: Connect4Board, col: number): boolean {
  return board[0][col] !== null
}

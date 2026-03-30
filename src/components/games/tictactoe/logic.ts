export type TicTacToeBoard = (string | null)[]

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
]

export function initialBoard(): TicTacToeBoard {
  return Array(9).fill(null)
}

export function applyMove(board: TicTacToeBoard, index: number, player: string): TicTacToeBoard {
  if (board[index] !== null) return board
  const next = [...board]
  next[index] = player
  return next
}

export function checkWinner(board: TicTacToeBoard): string | 'draw' | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as string
    }
  }
  if (isBoardFull(board)) return 'draw'
  return null
}

export function isBoardFull(board: TicTacToeBoard): boolean {
  return board.every(cell => cell !== null)
}

export function getWinningLine(board: TicTacToeBoard): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line
    }
  }
  return null
}

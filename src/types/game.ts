import type { ComponentType } from 'react'

export interface BoardProps<TBoard = unknown, TMove = unknown> {
  board: TBoard
  onMove: (move: TMove) => void
  currentTurn: string
  myNickname: string
  player1Nickname: string
  player2Nickname: string
  disabled: boolean
}

export interface GamePlugin<TBoard = unknown, TMove = unknown> {
  id: string
  displayName: string
  emoji: string
  description: string
  initialBoard: () => TBoard
  applyMove: (board: TBoard, move: TMove, player: string) => TBoard
  checkWinner: (board: TBoard) => string | 'draw' | null
  isBoardFull: (board: TBoard) => boolean
  BoardComponent: ComponentType<BoardProps<TBoard, TMove>>
}

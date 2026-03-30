import type { ComponentType } from 'react'
import { TicTacToe } from './TicTacToe'
import { initialBoard, applyMove, checkWinner, isBoardFull } from './logic'
import type { GamePlugin, BoardProps } from '../../../types/game'
import type { TicTacToeBoard } from './logic'

export const tictactoePlugin: GamePlugin<TicTacToeBoard, number> = {
  id: 'tictactoe',
  displayName: 'Tic Tac Toe',
  emoji: '❌',
  description: 'Classic 3×3 grid — get three in a row to win',
  initialBoard,
  applyMove,
  checkWinner,
  isBoardFull,
  BoardComponent: TicTacToe as ComponentType<BoardProps<TicTacToeBoard, number>>,
}

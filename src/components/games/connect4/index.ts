import type { ComponentType } from 'react'
import { Connect4 } from './Connect4'
import { initialBoard, applyMove, checkWinner, isBoardFull } from './logic'
import type { GamePlugin, BoardProps } from '../../../types/game'
import type { Connect4Board } from './logic'

export const connect4Plugin: GamePlugin<Connect4Board, number> = {
  id: 'connect4',
  displayName: 'Connect 4',
  emoji: '🔴',
  description: 'Drop discs — connect four in a row to win',
  initialBoard,
  applyMove,
  checkWinner,
  isBoardFull,
  BoardComponent: Connect4 as ComponentType<BoardProps<Connect4Board, number>>,
}

import { tictactoePlugin } from './tictactoe'
import { connect4Plugin } from './connect4'
import type { GamePlugin } from '../../types/game'

export const GAME_REGISTRY: Record<string, GamePlugin> = {
  tictactoe: tictactoePlugin as unknown as GamePlugin,
  connect4: connect4Plugin as unknown as GamePlugin,
}

export const AVAILABLE_GAMES = Object.values(GAME_REGISTRY)

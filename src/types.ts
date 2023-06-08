export interface BlockState {
  x: number
  y: number
  length?: number
  revealed?: boolean
  mine?: boolean
  adjacentMines?: number
  [key: string]: any
}

import type { BlockState } from '~/types'

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

export class GamePlay {
  state = ref<BlockState[][]>([])
  mineGenerated = false

  constructor(
    public width: number,
    public height: number,
  ) {
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        }),
      ),
    )
  }

  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of this.state.value) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1)
          continue
        if (Math.abs(initial.y - block.y) <= 1)
          continue
        block.mine = Math.random() < 0.3
      }
    }
    this.calculateadjacentMines()
  }

  calculateadjacentMines() {
    this.state.value.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block)
          .forEach((b) => {
            if (b.mine)
              block.adjacentMines += 1
          })
      })
    })
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return
    this.getSiblings(block).forEach((s) => {
      if (!s.revealed) {
        s.revealed = true
        this.expendZero(s)
      }
    })
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
  }

  onClick(block: BlockState) {
    // console.log('clicked x:', x, 'y:', y)
    // console.log('成功点击')
    if (!this.mineGenerated) {
      this.mineGenerated = true
      this.generateMines(this.state.value, block)
    }
    block.revealed = true
    if (block.mine)
      // eslint-disable-next-line no-alert
      alert('What a pity:you lost!')
    this.expendZero(block)
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.Width || y2 < 0 || y2 >= this.Height)
        return undefined
      return this.state.value[y2][x2]
    })
      .filter(Boolean) as BlockState[]
  }

  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.state.value.flat()
    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => block.flagged && !block.mine))
        // eslint-disable-next-line no-alert
        alert('You cheat!')
      else
        // eslint-disable-next-line no-alert
        alert('You win!')
    }
  }
}

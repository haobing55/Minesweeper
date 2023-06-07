<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  length?: number
  revealed?: boolean
  mine?: boolean
  adjacentMines?: number
  [key: string]: any
}
const Height = 10
const Width = 10
const state = reactive(Array.from({ length: Height }, (_, y) =>
  Array.from({ length: Width }, (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })),
))
function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.3
    }
  }
  calculateadjacentMines(state)
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
]
function calculateadjacentMines(Array: Array<BlockState>) {
  const rows = Array.length
  const cols: number = Array[0]?.length ?? 0 // 如果Array[0]存在，则取其长度；否则，将长度默认为0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Array[i][j].mine)
        continue

      let adjacentMines = 0

      for (const dir of directions) {
        const x = i + dir[0]
        const y = j + dir[1]

        if (x < 0 || x >= rows || y < 0 || y >= cols)
          continue

        if (Array[x][y].mine)
          adjacentMines++
      }

      Array[i][j].adjacentMines = adjacentMines
    }
  }

  return Array
}
const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]

function updateBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/50'
  else
    return block.mine ? 'bg-red/50' : numberColors[block.adjacentMines ?? -1]
}
let mineGenerated = false
const dev = false
function onClick(block: BlockState) {
  // console.log('clicked x:', x, 'y:', y)
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine)
    alert('What a pity:you lost!')
  expendZero(block)
}
function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= Width || y2 < 0 || y2 >= Height)
      return undefined
    return state[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}
</script>

<template>
  <div>
    Minesweeper
    <div p5>
      <div
        v-for="row, y in state"
        :key="y"
        flex="~"
        items-center justify-center
      >
        <button
          v-for="block, x in row"
          :key="x"
          flex="~"
          border="0.5 gray-400/10"
          :class="updateBlockClass(block)"
          m="0.5"
          min-h-8 min-w-8 items-center justify-center
          hover="bg-gray/10"
          @click="onClick(block)"
        >
          <template v-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi:mine />
            <div v-else>
              {{ block.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

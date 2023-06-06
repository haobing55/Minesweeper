<script setup lang="ts">
interface BlockState {
  revealed?: boolean
  mine?: boolean
  adjacentMines?: number
}
const Height = 10
const Width = 10
const state = reactive(Array.from({ length: Height }, (_, y) =>
  Array.from({ length: Width }, (_, x): BlockState => ({ adjacentMines: 0, revealed: false })),
))
function generateMines() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.3
  }
}
function calculateadjacentMines(Array) {
  const rows = Array.length
  const cols = Array[0].length

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ]

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
    return ''
  else
    return block.mine ? 'bg-red/50' : numberColors[block.adjacentMines]
}
function onClick(block: BlockState) {
  // console.log('clicked x:', x, 'y:', y)
  block.revealed = true
}
generateMines()
calculateadjacentMines(state)
</script>

<template>
  <div>
    Mineswepper
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
          <template v-if="block.revealed">
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

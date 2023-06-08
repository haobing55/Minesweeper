<script setup lang="ts">
import type { BlockState } from '~/types'

$defineProps<{ block: BlockState }>()

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
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  else
    return block.mine ? 'bg-red/50' : numberColors[block.adjacentMines ?? -1]
}
</script>

<template>
  <button
    flex="~"
    border="0.5 gray-400/10"
    :class="updateBlockClass(block)"
    m="0.5"
    min-h-8 min-w-8 items-center justify-center
    hover="bg-gray/10"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed || true">
      <div v-if="block.mine" i-mdi:mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  total: { type: Number, required: true },
  pageCount: { type: Number, default: 10 },
  activeColor: { type: String, default: 'primary' },
})

const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.ceil(props.total / props.pageCount))

const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 7
  if (totalPages.value <= maxDisplayed) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  }
  else {
    if (props.page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages.value)
    }
    else if (props.page >= totalPages.value - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - 4; i <= totalPages.value; i++) pages.push(i)
    }
    else {
      pages.push(1)
      pages.push('...')
      pages.push(props.page - 1)
      pages.push(props.page)
      pages.push(props.page + 1)
      pages.push('...')
      pages.push(totalPages.value)
    }
  }
  return pages
})

function setPage(n: any) {
  if (n === '...')
    return
  if (n >= 1 && n <= totalPages.value)
    emit('update:page', n)
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center space-x-1">
    <button
      :disabled="page === 1"
      class="px-2 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="setPage(page - 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>

    <button
      v-for="(p, index) in displayedPages"
      :key="index"
      :disabled="p === '...'"
      class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
      :class="[
        page === p
          ? 'bg-blue-600 text-white border border-blue-600'
          : p === '...'
            ? 'text-gray-500 bg-transparent cursor-default'
            : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
      ]" @click="setPage(p)"
    >
      {{ p }}
    </button>

    <button
      :disabled="page === totalPages"
      class="px-2 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="setPage(page + 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

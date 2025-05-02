<template>
  <UCard variant="subtle">
    <div class="h-72 overflow-hidden">
      <div class="flex flex-col">
        <div
          :class="[
            'size-16 items-center justify-center flex rounded-full p-2 border',
            getBgColorClass,
            getBorderColorClass,
          ]"
        >
          <UIcon
            :name="props.icon"
            :class="['size-10', getTextColorClass]"
          />
        </div>

        <p class="my-16 leading-6 text-neutral-400">
          {{ props.content }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="h-8">
        <div class="flex gap-10">
          <p
            v-for="(tag, idx) in props.tags"
            :key="idx"
            class="text-neutral-500 text-sm"
          >
            {{ tag }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  content: string
  icon: string
  tags: string[]
  colorScheme?: 'amber' | 'blue' | 'green' | 'red' | 'purple' | 'indigo' | 'pink'
}>()

// Mapear o esquema de cores para as classes Tailwind correspondentes
const colorMappings = {
  amber: {
    bg: 'bg-amber-300/15',
    border: 'border-amber-500/20',
    text: 'text-amber-500',
  },
  blue: {
    bg: 'bg-blue-300/15',
    border: 'border-blue-500/20',
    text: 'text-blue-500',
  },
  green: {
    bg: 'bg-green-300/15',
    border: 'border-green-500/20',
    text: 'text-green-500',
  },
  red: {
    bg: 'bg-red-300/15',
    border: 'border-red-500/20',
    text: 'text-red-500',
  },
  purple: {
    bg: 'bg-purple-300/15',
    border: 'border-purple-500/20',
    text: 'text-purple-500',
  },
  indigo: {
    bg: 'bg-indigo-300/15',
    border: 'border-indigo-500/20',
    text: 'text-indigo-500',
  },
  pink: {
    bg: 'bg-pink-300/15',
    border: 'border-pink-500/20',
    text: 'text-pink-500',
  },
}

// Computed properties para obter as classes de cor corretas
const getBgColorClass = computed(() => {
  return colorMappings[props.colorScheme || 'amber'].bg
})

const getBorderColorClass = computed(() => {
  return colorMappings[props.colorScheme || 'amber'].border
})

const getTextColorClass = computed(() => {
  return colorMappings[props.colorScheme || 'amber'].text
})
</script>

<template>
  <!-- TODO: Add hyphens and refactor break lines -->
  <div
    :class="[
      'flex items-start gap-2.5',
      myMessage ? 'flex-row-reverse' : 'flex-row',
    ]"
  >
    <img
      class="size-8 rounded-full"
      src="https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg?ga=GA1.1.35360649.1747917769&semt=ais_hybrid&w=740"
      alt="Avatar image"
    >
    <div
      :class="[
        'flex flex-col gap-1 w-full',
        myMessage ? 'items-end' : 'items-start',
      ]"
    >
      <div
        :class="[
          'flex items-center space-x-2',
          myMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row',
        ]"
      >
        <span class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ myMessage ? 'Você' : user?.name }}
        </span>
        <time
          v-if="message"
          class="text-xs opacity-50"
        >
          {{ useTimeAgo(message?.createdAt).value }}
        </time>
      </div>
      <div
        :class="[
          'flex flex-col leading-1.5 break-all p-3 border-gray-200 rounded-xl text-sm font-normal text-gray-900 dark:text-white',
          myMessage
            ? 'bg-gray-100 dark:bg-gray-700 rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none',
        ]"
      >
        <slot>
          <MarkdownRenderer
            :source="message?.text || `That's awesome. I think our users will really appreciate the improvements.`"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Message, User } from '~~/types'

defineProps<{
  message?: Message
  user?: User
  myMessage?: boolean
}>()
</script>

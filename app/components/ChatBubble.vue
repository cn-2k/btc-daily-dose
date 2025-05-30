<template>
  <div
    :class="[
      'flex items-start gap-4 group',
      myMessage ? 'flex-row-reverse' : 'flex-row',
    ]"
  >
    <!-- Avatar com gradiente e status indicator -->
    <div class="relative flex-shrink-0">
      <div
        :class="[
          'size-10 rounded-full overflow-hidden ring-2 transition-all duration-200 group-hover:ring-4',
          myMessage
            ? 'ring-blue-800 group-hover:ring-blue-700'
            : 'ring-purple-800 group-hover:ring-purple-700',
        ]"
      >
        <img
          class="w-full h-full object-cover"
          :src="myMessage ? '/user.jpg' : '/robot.jpg'"
          :alt="`Avatar de ${myMessage ? 'Você' : user?.name}`"
        >
      </div>
      <!-- Status online indicator -->
      <div
        v-if="!myMessage"
        class="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"
      />
    </div>

    <!-- Message container -->
    <div
      :class="[
        'flex flex-col gap-2 max-w-[80%] min-w-[120px]',
        myMessage ? 'items-end' : 'items-start',
      ]"
    >
      <!-- Header com nome e timestamp -->
      <div
        :class="[
          'flex items-center gap-2 px-1',
          myMessage ? 'flex-row-reverse' : 'flex-row',
        ]"
      >
        <span
          :class="[
            'text-sm font-semibold',
            myMessage
              ? 'text-blue-600'
              : 'text-purple-600',
          ]"
        >
          {{ myMessage ? 'Você' : user?.name }}
        </span>
        <time
          v-if="message"
          class="text-xs text-gray-500"
        >
          <NuxtTime
            :datetime="message.createdAt"
            relative
          />
        </time>
      </div>

      <!-- Message bubble com glassmorphism -->
      <div
        :class="[
          'relative px-4 rounded-2xl backdrop-blur-sm border transition-all duration-200 group-hover:shadow-lg',
          myMessage
            ? [
              'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400/20',
              'rounded-tr-md shadow-lg shadow-blue-500/20',
              'hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/30',
            ]
            : [
              'bg-gray-800/80 text-white border-gray-700/50',
              'rounded-tl-md shadow-sm',
              'bg-gray-800/90 hover:shadow-md',
            ],
        ]"
      >
        <!-- Message content -->
        <div class="relative z-10">
          <slot>
            <MarkdownRenderer
              :source="message?.text || ''"
              :class="[
                'prose prose-sm max-w-none',
                myMessage
                  ? 'prose-invert [&_*]:text-white [&_a]:text-blue-100 hover:[&_a]:text-white [&_code]:text-blue-100 [&_code]:bg-blue-400/20'
                  : 'prose-invert [&_a]:text-blue-400 [&_code]:text-gray-200 [&_code]:bg-gray-700/50',
              ]"
            />
          </slot>
        </div>

        <!-- Decorative gradient overlay for user messages -->
        <div
          v-if="myMessage"
          class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl rounded-tr-md pointer-events-none"
        />

        <!-- Message tail/arrow -->
        <div
          :class="[
            'absolute top-3 w-2 h-2 transform rotate-45',
            myMessage
              ? 'right-[-4px] bg-gradient-to-br from-blue-500 to-blue-600'
              : 'left-[-4px] bg-white/80 dark:bg-gray-800/80 border-l border-t border-gray-700/50',
          ]"
        />
      </div>

      <!-- Message status indicators (para mensagens do usuário) -->
      <div
        v-if="myMessage && message"
        class="flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <UIcon
          name="i-lucide-check"
          class="text-xs text-gray-500"
        />
        <span class="text-xs text-gray-500">
          Enviado
        </span>
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

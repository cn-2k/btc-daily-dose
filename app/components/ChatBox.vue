<template>
  <UPopover
    v-model:open="open"
    :dismissible="false"
    :content="{
      side: 'top',
      align: 'end',
      sideOffset: 10,
      alignOffset: -10,
    }"
    :ui="{
      content: 'w-[95vw] sm:w-[380px] md:w-[420px] lg:w-[450px] xl:w-[480px]',
    }"
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50"
  >
    <UButton
      icon="i-mdi:chat-processing-outline"
      class="rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
      size="xl"
      :ui="{
        leadingIcon: 'text-white size-8 sm:size-10',
      }"
    />

    <template #content>
      <div class="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50  shadow-2xl shadow-black/20 overflow-hidden scroll-smooth">
        <header class="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border-b border-gray-700/50">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="size-7 sm:size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <UIcon
                name="i-mdi:robot-outline"
                class="text-white text-sm sm:text-base"
              />
            </div>
            <div>
              <h2 class="font-semibold text-white text-sm sm:text-base">
                Assistente IA
              </h2>
              <p class="text-xs text-green-500">
                Online agora
              </p>
            </div>
          </div>

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="sm"
            class="hover:bg-gray-800 rounded-full transition-colors duration-200 p-1.5"
            @click="open = false"
          />
        </header>

        <div
          ref="messageBox"
          class="messages scroll-smooth overflow-x-hidden p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] lg:max-h-[55vh] min-h-[250px] sm:min-h-[300px] bg-gradient-to-b from-gray-800/30 to-gray-900/30"
        >
          <div
            v-if="!props.messages.length"
            class="text-center m-auto h-full flex flex-col justify-center items-center px-2"
          >
            <div class="size-12 sm:size-16 rounded-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center mb-3 sm:mb-4">
              <UIcon
                name="i-mdi:chat-question-outline"
                class="text-2xl sm:text-3xl text-blue-400"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2">
              Converse com o Assistente IA
            </h3>
            <p class="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-xs sm:max-w-sm text-center leading-relaxed">
              Tire dúvidas sobre análises e obtenha insights personalizados
            </p>

            <!-- Sugestões de perguntas com cards modernos -->
            <div class="space-y-2 sm:space-y-3 w-full max-w-xs sm:max-w-md">
              <p class="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                💡 Experimente perguntar algo como:
              </p>
              <div class="space-y-2 sm:space-y-3">
                <p class="text-xs sm:text-sm text-gray-300">
                  "Faça um resumo dessa análise"
                </p>
                <p class="text-xs sm:text-sm text-gray-300">
                  "Quais os principais pontos de entrada?"
                </p>
                <p class="text-xs sm:text-sm text-gray-300">
                  "Explique os indicadores mencionados"
                </p>
              </div>
            </div>
          </div>

          <!-- Container das mensagens com animação -->
          <div
            v-auto-animate="{ duration: 200, easing: 'ease-in-out' }"
            class="flex flex-col gap-4 sm:gap-6"
          >
            <ChatBubble
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :user="getUser(message.userId)"
              :my-message="message.userId === props.me.id"
            />

            <ChatBubble
              v-for="user in usersTyping"
              :key="`typing-${user.id}`"
              :user="user"
              :my-message="false"
            >
              <div class="flex items-center gap-2 py-2">
                <span class="text-sm text-gray-400 animate-pulse">
                  Digitando...
                </span>
              </div>
            </ChatBubble>
          </div>
        </div>

        <footer class="p-3 sm:p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50">
          <!-- Input area -->
          <div class="flex gap-2 sm:gap-3 items-end">
            <div class="flex-1 relative">
              <UInput
                ref="input"
                v-model="inputMessage"
                class="w-full"
                placeholder="Digite sua mensagem..."
                variant="outline"
                autofocus
                type="text"
                size="lg"
                :disabled="!!usersTyping.length"
                @keypress.enter="sendMessage"
              />
            </div>

            <UButton
              icon="i-mdi:send"
              size="lg"
              :disabled="!inputMessage.trim()"
              :ui="{
                leadingIcon: 'text-white',
              }"
              class="rounded disabled:bg-gray-500/70 px-3 sm:px-4 bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              @click="sendMessage"
            />
          </div>
        </footer>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { vAutoAnimate } from '@formkit/auto-animate'
import type { Message, User } from '~~/types'

const props = withDefaults(
  defineProps<{
    messages: Message[]
    users: User[]
    me: User
    usersTyping?: User[]
  }>(),
  {
    usersTyping: () => [],
  },
)

const emit = defineEmits<{
  (e: 'newMessage', payload: Message): void
}>()

const open = ref(false)
const inputMessage = ref('')
const input = ref()
const messageBox = ref()

function getUser(id: string) {
  return props.users.find(user => user.id === id)
}

function sendMessage() {
  if (!inputMessage.value.trim()) return

  emit('newMessage', {
    id: nanoid(),
    userId: props.me.id,
    createdAt: new Date(),
    text: inputMessage.value,
  })

  inputMessage.value = ''
}

function scrollToBottom(force = false) {
  if (!messageBox.value) return

  const element = messageBox.value

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const scrollHeight = element.scrollHeight
      const clientHeight = element.clientHeight
      const maxScrollTop = scrollHeight - clientHeight

      if (force) {
        element.scrollTop = maxScrollTop + 50
      }
      else {
        element.scrollTop = maxScrollTop
      }
    })
  })
}

watch(
  () => props.messages,
  () => {
    setTimeout(() => {
      scrollToBottom()
    }, 250)
  },
  { deep: true },
)

watch(open, (newValue) => {
  if (newValue && props.messages.length > 0) {
    setTimeout(() => {
      scrollToBottom(true)
    }, 100)
  }
})

onMounted(() => {
  if (props.messages.length > 0) {
    nextTick(() => {
      scrollToBottom(true)
    })
  }
})
</script>

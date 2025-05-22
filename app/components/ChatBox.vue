<template>
  <UPopover
    v-model:open="open"
    :dismissible="false"
    class="fixed bottom-[30px] right-[30px]"
  >
    <UButton
      icon="i-mdi:chat-processing-outline"
      class="rounded-full bg-blue-500 size-16 flex items-center justify-center hover:bg-blue-600"
      :ui="{
        leadingIcon: 'text-white size-10',
      }"
    />

    <template #content>
      <header class="flex justify-between items-center p-3 bg-black/30 rounded-t">
        <h2 class="font-semibold">
          Chat (Assistente)
        </h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="open = false"
        />
      </header>

      <div
        ref="messageBox"
        class="messages p-4 w-[460px] overflow-y-auto max-h-[60vh]"
      >
        <div
          v-if="!props.messages.length"
          class="text-center m-auto"
        >
          <strong class="text-lg">Converse com um assistente!</strong>
          <p>Tire dúvidas sobre a análise com um assistente interativo.</p>
          <strong class="block mt-10 mb-2">Vá em frente e pergunte algo:</strong>
          <ul class="list-inside list-disc text-left">
            <li>What is social media post generator?</li>
            <li>How can I get human support?</li>
            <li>How was this tool built?</li>
          </ul>
        </div>

        <div class="flex flex-col gap-4">
          <ChatBubble
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :user="getUser(message.userId)"
            :my-message="false"
          />

          <ChatBubble
            v-for="user in usersTyping"
            :key="user.id"
            :user="user"
          >
            <AppLoading />
          </ChatBubble>
        </div>
      </div>

      <footer class="p-2">
        <div class="flex gap-2 mt-6">
          <UInput
            v-model="inputMessage"
            class="w-full"
            placeholder="Escreva sua mensagem"
            variant="subtle"
            autofocus
            type="text"
            size="lg"
            @keypress.enter="sendMessage"
          />
          <UButton
            icon="i-mdi:send"
            size="lg"
            variant="subtle"
            @click="sendMessage"
          />
        </div>
        <p
          v-if="usersTyping.length"
          class="text-xs mt-2 italic text-neutral-500"
        >
          <span>
            {{ usersTyping.map((user) => user.name).join(" and ") }}
            {{ usersTyping.length === 1 ? "is" : "are" }} typing
          </span>
        </p>
      </footer>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
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

function getUser(id: string) {
  return props.users.find(user => user.id === id)
}

// focus input whenever chatbox is opened
const input = ref()
watch(open, () => {
  if (!open.value) return
  nextTick(() => {
    (input.value as HTMLInputElement).focus()
  })
})

function sendMessage() {
  if (!inputMessage.value.trim()) return

  emit('newMessage', {
    id: nanoid(),
    userId: props.me.id,
    createdAt: new Date(),
    text: inputMessage.value,
  })

  // Limpar o campo de entrada após enviar
  inputMessage.value = ''
}

// keep messages anchored to bottom
const messageBox = ref()
watch(
  () => props.messages,
  () => {
    nextTick(
      () => (messageBox.value.scrollTop = messageBox.value.scrollHeight),
    )
  },
  { deep: true },
)
</script>

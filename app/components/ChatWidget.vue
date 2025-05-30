<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { Message, User } from '~~/types'

const me = ref<User>({
  id: 'user',
  avatar: 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg?semt=ais_hybrid&w=740',
  name: 'You',
})
const bot = ref<User>({
  id: 'assistant',
  avatar: 'https://img.freepik.com/free-vector/ai-technology-robot-cyborg-illustrations_24640-134419.jpg?ga=GA1.1.35360649.1747917769&semt=ais_hybrid&w=740',
  name: 'Botman',
})

const { chatWithOpenAI, error } = useOpenAIProxy()
const { analysisResult } = useAnalysis()

const users = computed(() => [me.value, bot.value])

const messages = ref<Message[]>([])

const usersTyping = ref<User[]>([])

const systemPrompt = computed(() => {
  return `Você é um assistente útil especializado em análise de mercado de criptomoedas. Forneça respostas curtas e objetivas. Seja conciso e forneça informações baseadas na análise atual: ${analysisResult.value?.response}`
})

async function handleNewMessage(message: Message) {
  // Adicionar a mensagem do usuário ao histórico
  messages.value.push(message)

  // Indicar que o bot está digitando
  usersTyping.value.push(bot.value)

  try {
    const response = await chatWithOpenAI(
      messages.value,
      systemPrompt.value,
      {
        enableWebSearch: true,
        model: 'gpt-4.1',
        temperature: 0.5,
      },
    )

    // Criar mensagem de resposta do assistente
    const botMessage: Message = {
      id: nanoid(),
      userId: bot.value.id,
      createdAt: new Date(),
      text: response,
    }

    // Adicionar a resposta do assistente ao histórico
    messages.value.push(botMessage)
  }
  catch (err) {
    // Tratar erros
    console.error('Erro ao processar mensagem:', err)

    // Opcional: Adicionar mensagem de erro ao chat
    messages.value.push({
      id: nanoid(),
      userId: bot.value.id,
      createdAt: new Date(),
      text: `Desculpe, ocorreu um erro: ${error.value || 'Erro desconhecido'}`,
    })
  }
  finally {
    usersTyping.value = []
  }
}
</script>

<template>
  <ChatBox
    v-if="analysisResult?.response"
    :me="me"
    :users="users"
    :messages="messages"
    :users-typing="usersTyping"
    @new-message="handleNewMessage"
  />
</template>

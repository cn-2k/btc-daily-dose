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

const users = computed(() => [me.value, bot.value])

const messages = ref<Message[]>([])

const usersTyping = ref<User[]>([])

const systemPrompt = 'Você é um assistente útil especializado em análise de mercado de criptomoedas. Seja conciso e forneça informações precisas.'

async function handleNewMessage(message: Message) {
  // Adicionar a mensagem do usuário ao histórico
  messages.value.push(message)

  // Indicar que o bot está digitando
  usersTyping.value.push(bot.value)

  try {
    // Enviar o histórico completo de mensagens para a API
    const response = await chatWithOpenAI(messages.value, systemPrompt)

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
    // Remover indicação de digitação
    usersTyping.value = []
  }
}
</script>

<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    :users-typing="usersTyping"
    @new-message="handleNewMessage"
  />
</template>

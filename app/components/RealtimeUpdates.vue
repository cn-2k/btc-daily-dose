<template>
  <div class="flex flex-col items-center justify-center mt-36">
    <!-- Spinner centralizado -->
    <div>
      <UIcon
        name="i-svg-spinners:180-ring-with-bg"
        class="size-28 text-amber-500"
      />
    </div>

    <!-- Container de mensagens de log -->
    <div class="w-full text-white">
      <div
        v-if="messages.length === 0"
        class="text-gray-400 text-center py-5 animate-pulse"
      >
        Iniciando a análise, um momento...
      </div>
      <div
        v-else
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="text-gray-400 text-center py-5 animate-pulse"
        >
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  initialMessage?: string
}>()

const messages = ref<string[]>([])
const isConnected = ref(false)
const totalLogsCount = ref(0)
let eventSource: EventSource | null = null

// Função para estabelecer conexão SSE
const connectToSSE = () => {
  // Fechar conexão existente se houver
  if (eventSource) {
    eventSource.close()
  }

  // Mostrar mensagem inicial se fornecida
  if (props.initialMessage) {
    messages.value.push(props.initialMessage)
    totalLogsCount.value++
  }

  // Criar nova conexão SSE
  eventSource = new EventSource('/api/updates')

  eventSource.onopen = () => {
    isConnected.value = true
  }

  eventSource.onerror = (error) => {
    isConnected.value = false
    console.error('Erro ao conectar ao SSE', error)
    messages.value.push('Erro de conexão. Tentando reconectar...')
    // Tentar reconectar após um atraso
    setTimeout(connectToSSE, 3000)
  }

  eventSource.onmessage = (event) => {
    // Limpa as mensagens e adiciona a nova, mantendo somente 1 mensagem por vez
    messages.value = []

    // Adicionar nova mensagem à lista
    messages.value.push(event.data)
    totalLogsCount.value++

    // Garantir que o scroll fique no final para mostrar as mensagens mais recentes
    setTimeout(() => {
      const container = document.querySelector('.overflow-y-auto')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 100)
  }

  // Limpa todas as mensagens evitando que sobre alguma
  messages.value = []

  isConnected.value = true
}

onMounted(() => {
  connectToSSE()
})

// Limpar quando o componente for desmontado
onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>

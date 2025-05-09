<template>
  <div class="flex items-center gap-2">
    <UButtonGroup size="xl">
      <UBadge
        icon="i-mdi-bitcoin"
        color="neutral"
        variant="outline"
      >
        <div
          class="font-bold transition-colors"
          :class="{ 'text-green-500': priceIncreased, 'text-red-500': priceDecreased }"
        >
          {{ formatCurrency(currentPrice) }}
        </div>
      </UBadge>

      <UTooltip
        text="Atualizar conexão"
        :delay-duration="0"
        :content="{ side: 'top' }"
        disable-hoverable-content
      >
        <UButton
          icon="i-material-symbols-sync-rounded"
          variant="outline"
          color="neutral"
          :loading="isUpdating"
          @click="updateConnection()"
        />
      </UTooltip>

      <UChip
        size="xl"
        color="warning"
        inset
        :ui="{ base: 'animate-pulse' }"
      >
        <UTooltip
          text="Configurações"
          :delay-duration="0"
          :content="{ side: 'top' }"
          disable-hoverable-content
        >
          <UButton
            icon="i-material-symbols-light:settings"
            variant="outline"
            color="neutral"
            :loading="isUpdating"
            @click="openDialog = true"
          />
        </UTooltip>
      </UChip>
    </UButtonGroup>
  </div>

  <UModal
    v-model:open="openDialog"
    title="Inserir chave de API"
    description="Insira sua chave de API da OpenAI"
    :ui="{ footer: 'justify-end' }"
  >
    <template #title>
      <p>Inserir chave de API</p>
    </template>

    <template #body>
      <div>
        <UFormField
          label="Chave API"
        >
          <UInput
            v-model="apiKey"
            class="w-full"
            placeholder="sk-XXXXXXXXXXXXXXXXXX"
            icon="i-mdi-key"
          />
        </UFormField>
        <p class="text-xs text-end mt-2 text-gray-300/80">
          Você consegue obter sua chave clicando <NuxtLink
            class="text-blue-400 font-bold underline"
            href="https://platform.openai.com/api-keys"
            target="_blank"
          >aqui.</NuxtLink>
        </p>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Cancelar"
        color="neutral"
        variant="outline"
        @click="openDialog = false"
      />
      <UButton
        label="Confirmar"
        color="success"
      />
    </template>
  </UModal>
</template>

<script setup>
const currentPrice = ref(null)
const previousPrice = ref(null)
const latestReceivedPrice = ref(null)
const priceIncreased = ref(false)
const priceDecreased = ref(false)
const isConnected = ref(false)
const isUpdating = ref(false)
const openDialog = ref(false)
const apiKey = ref('')

let socket = null

// Função para formatar o valor como moeda
const formatCurrency = (value) => {
  if (value === null) return 'Conectando...'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Função para conectar ao WebSocket da Binance
const connectWebSocket = () => {
  // Desconecta qualquer socket existente
  if (socket !== null) {
    socket.close()
  }

  // Conecta ao stream de trades do par BTC/USDT da Binance
  socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade')

  socket.onopen = () => {
    isConnected.value = true
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // Apenas armazenamos o preço mais recente recebido, mas não atualizamos a UI ainda
    latestReceivedPrice.value = parseFloat(data.p) // preço da trade
  }

  socket.onclose = () => {
    isConnected.value = false
    // Tentar reconectar após 5 segundos
    setTimeout(connectWebSocket, 5000)
  }

  socket.onerror = (error) => {
    console.error(error)
    isConnected.value = false
  }
}

// Função para atualizar o preço exibido na UI com base na taxa selecionada
const updateDisplayPrice = () => {
  isUpdating.value = true
  if (latestReceivedPrice.value !== null) {
    previousPrice.value = currentPrice.value
    currentPrice.value = latestReceivedPrice.value

    // Resetar estado visual
    priceIncreased.value = false
    priceDecreased.value = false

    // Comparar com o preço anterior
    if (previousPrice.value !== null) {
      if (currentPrice.value > previousPrice.value) {
        priceIncreased.value = true
        // Resetar após 1 segundo
        setTimeout(() => {
          priceIncreased.value = false
        }, 1000)
      }
      else if (currentPrice.value < previousPrice.value) {
        priceDecreased.value = true
        // Resetar após 1 segundo
        setTimeout(() => {
          priceDecreased.value = false
        }, 1000)
      }
    }
  }
  isUpdating.value = false
}

const updateConnection = async () => {
  socket.close()
  clearInterval()
  connectWebSocket()
}

onMounted(() => {
  connectWebSocket()
  setInterval(updateDisplayPrice, 2000)
})

onBeforeUnmount(() => {
  if (socket) {
    socket.close()
  }

  clearInterval()
})
</script>

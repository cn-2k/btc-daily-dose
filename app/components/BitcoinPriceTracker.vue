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
      >
        <UButton
          icon="i-material-symbols-sync-rounded"
          variant="outline"
          color="neutral"
          :loading="isUpdating"
          @click="updateConnection()"
        />
      </UTooltip>
      <UTooltip
        text="Inserir chave de API"
        :delay-duration="0"
        :content="{ side: 'top' }"
      >
        <UButton
          icon="i-material-symbols:key"
          variant="outline"
          color="neutral"
          :loading="isUpdating"
          @click="updateConnection()"
        />
      </UTooltip>
    </UButtonGroup>
  </div>
</template>

<script setup>
const currentPrice = ref(null)
const previousPrice = ref(null)
const latestReceivedPrice = ref(null)
const priceIncreased = ref(false)
const priceDecreased = ref(false)
const isConnected = ref(false)
const isUpdating = ref(false)

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

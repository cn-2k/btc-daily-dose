interface BinanceTickerData {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  p: string // Price change
  P: string // Price change percent
  w: string // Weighted average price
  c: string // Last price
  Q: string // Last quantity
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
  O: number // Statistics open time
  C: number // Statistics close time
  F: number // First trade ID
  L: number // Last trade ID
  n: number // Total number of trades
}

// Singleton para WebSocket
let socket: WebSocket | null = null
let reconnectAttempt = 0
const maxReconnectAttempts = 5
let subscribers = 0

export function useBTCPrice() {
  const currentPrice = ref<number | null>(null)
  const previousPrice = ref<number | null>(null)
  const priceIncreased = ref<boolean>(false)
  const priceDecreased = ref<boolean>(false)
  const isConnected = ref<boolean>(false)
  const isUpdating = ref<boolean>(false)

  // Função para formatar o valor como moeda
  const formatCurrency = (value: number | null): string => {
    if (value === null) return 'Conectando...'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Função para conectar ao WebSocket da Binance - utiliza ticker em vez de trades
  const connectWebSocket = (): void => {
    // Se o socket já existe, apenas incrementa os subscribers
    if (socket !== null && socket.readyState !== WebSocket.CLOSED) {
      subscribers++
      return
    }

    // Conecta ao stream de ticker do par BTC/USDT da Binance (menos dados que o stream de trades)
    socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker')

    socket.onopen = () => {
      isConnected.value = true
      reconnectAttempt = 0 // Reset reconnect counter on successful connection
    }

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as BinanceTickerData

      // Apenas atualiza se o preço mudou
      const newPrice = parseFloat(data.c)
      if (currentPrice.value !== newPrice) {
        isUpdating.value = true
        previousPrice.value = currentPrice.value
        currentPrice.value = newPrice

        // Comparar com o preço anterior
        if (previousPrice.value !== null) {
          // Resetar estado visual
          priceIncreased.value = false
          priceDecreased.value = false

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

        isUpdating.value = false
      }
    }

    socket.onclose = () => {
      isConnected.value = false

      // Implementa backoff exponencial para reconexão
      if (reconnectAttempt < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000)
        reconnectAttempt++
        setTimeout(connectWebSocket, delay)
      }
    }

    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error)
      isConnected.value = false
    }

    subscribers++
  }

  const closeWebSocket = (): void => {
    subscribers--

    // Só fecha a conexão se não houver mais subscribers
    if (subscribers <= 0 && socket) {
      socket.close()
      socket = null
      subscribers = 0
    }
  }

  const updateConnection = async (): Promise<void> => {
    if (socket) {
      socket.close()
      socket = null
    }
    reconnectAttempt = 0
    connectWebSocket()
  }

  onMounted(() => {
    connectWebSocket()
  })

  onBeforeUnmount(() => {
    closeWebSocket()
  })

  return {
    currentPrice,
    previousPrice,
    priceIncreased,
    priceDecreased,
    isConnected,
    isUpdating,
    formatCurrency,
    updateConnection,
  }
}

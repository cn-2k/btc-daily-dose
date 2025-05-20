import type { AnalysisResponse, AnalysisRequestBody, AnalysisSource } from '@/types/analysis'

export const useAnalysis = () => {
  const analysisResult = ref<AnalysisResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const activeSource = ref<AnalysisSource | null>(null)
  const error = ref<string | null>(null)

  /**
   * Realiza scraping e análise do heatmap do BTC e gráfico TradingView juntos
   */
  const analyzeGeneral = async () => {
    return performAnalysis('general', async () => {
      const [tradingViewResponse, heatMapResponse] = await Promise.all([
        $fetch<{ screenshotBase64: string }>('/api/scrape/tradingview'),
        $fetch<{ screenshotBase64: string }>('/api/scrape/heatmap'),
      ])

      return $fetch<AnalysisResponse>('/api/analysis/general', {
        method: 'POST',
        body: {
          tradingViewScreenshot: tradingViewResponse.screenshotBase64,
          heatMap: heatMapResponse.screenshotBase64,
        } as AnalysisRequestBody,
      })
    })
  }

  /**
   * Realiza scraping e análise de uma única fonte
   * @param source Fonte a ser analisada: 'heatmap' ou 'tradingview'
   */
  const analyzeSingleSource = async (source: Exclude<AnalysisSource, 'general'>) => {
    return performAnalysis(source, async () => {
      const { screenshotBase64 } = await $fetch<{ screenshotBase64: string }>(`/api/scrape/${source}`)

      return $fetch<AnalysisResponse>(`/api/analysis/${source}`, {
        method: 'POST',
        body: { screenshot: screenshotBase64 } as AnalysisRequestBody,
      })
    })
  }

  /**
   * Função auxiliar para gerenciar o estado durante a análise
   */
  const performAnalysis = async (source: AnalysisSource, fetchFn: () => Promise<AnalysisResponse>) => {
    // Reset do estado
    analysisResult.value = null
    error.value = null
    isLoading.value = true
    activeSource.value = source

    try {
      // Executa a função de fetch passada como parâmetro
      analysisResult.value = await fetchFn()
      return analysisResult.value
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na análise'
      console.error(`Erro ao analisar ${source}:`, err)
      error.value = errorMessage
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    analysisResult,
    isLoading,
    activeSource,
    error,

    // Ações
    analyzeGeneral,
    analyzeSingleSource,

    // Helpers
    isActiveSource: (source: AnalysisSource) => activeSource.value === source,
  }
}

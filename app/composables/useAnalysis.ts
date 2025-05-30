import type { AnalysisResponse, AnalysisRequestBody, AnalysisSource } from '@/types/analysis'

const analysisResult = ref<AnalysisResponse | null>(null)

export const useAnalysis = () => {
  const isLoading = ref<boolean>(false)
  const activeSource = ref<AnalysisSource | null>(null)
  const error = ref<string | null>(null)

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
          heatMapScreenshot: heatMapResponse.screenshotBase64,
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
    // CORREÇÃO: Definir activeSource IMEDIATAMENTE quando o botão é clicado
    // Isso permite que o novo botão fique ativo e o anterior seja desativado
    activeSource.value = source

    // Reset do estado
    analysisResult.value = null
    error.value = null
    isLoading.value = true

    try {
      // Executa a função de fetch passada como parâmetro
      analysisResult.value = await fetchFn()
      return analysisResult.value
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na análise'
      console.error(`Erro ao analisar ${source}:`, err)
      error.value = errorMessage

      // CORREÇÃO: Em caso de erro, limpar o activeSource
      activeSource.value = null
      return null
    }
    finally {
      isLoading.value = false
      // NOTA: activeSource mantém o valor para mostrar qual foi a última análise bem-sucedida
    }
  }

  /**
   * NOVA FUNÇÃO: Permite limpar o estado ativo manualmente
   */
  const clearActiveSource = () => {
    activeSource.value = null
  }

  /**
   * NOVA FUNÇÃO: Permite definir qual fonte está ativa
   */
  const setActiveSource = (source: AnalysisSource | null) => {
    activeSource.value = source
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
    clearActiveSource,
    setActiveSource,
  }
}

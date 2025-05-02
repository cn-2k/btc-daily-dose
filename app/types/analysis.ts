export interface AnalysisResponse {
  success: boolean
  response: string
}

export interface AnalysisRequestBody {
  screenshot?: string
  screenshot1?: string
  screenshot2?: string
}

export type AnalysisSource = 'heatmap' | 'tradingview' | 'general'

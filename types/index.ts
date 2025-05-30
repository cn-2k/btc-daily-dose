export interface User {
  id: string
  avatar: string
  name: string
}
export interface Message {
  id: string
  userId: string
  createdAt: Date
  text: string
}
export type AsyncState = null | 'loading' | 'error' | 'complete'
export type SocialPlatforms = 'twitter' | 'facebook'

// types/openai.ts
export interface OpenAIResponseMessage {
  id: string
  type: 'message'
  role: 'assistant'
  content: Array<{
    type: 'output_text'
    text: string
    annotations: any[]
  }>
}

export interface OpenAIResponse {
  id: string
  object: 'response'
  created_at: number
  status: 'completed' | 'in_progress' | 'failed'
  error: any
  model: string
  output: OpenAIResponseMessage[]
  output_text?: string // Helper property from SDK
  usage: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

export interface OpenAIInputMessage {
  role: 'user' | 'assistant' | 'developer'
  content: string | Array<{
    type: 'input_text' | 'input_image'
    text?: string
    image_url?: string
  }>
}

export interface OpenAIRequestBody {
  model: string
  input: string | OpenAIInputMessage[]
  instructions?: string
  max_output_tokens?: number
  temperature?: number
  store?: boolean
}

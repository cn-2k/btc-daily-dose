import OpenAI from 'openai'

const runtimeConfig = useRuntimeConfig()

export const openAIClient = new OpenAI({
  apiKey: runtimeConfig.openaiApiKey,
})

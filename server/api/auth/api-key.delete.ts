// server/api/auth/api-key.delete.ts
import { clearUserApiKey } from '../../utils/apiKey'

export default defineEventHandler(async (event) => {
  try {
    // Remover a chave da sessão do usuário
    await clearUserApiKey(event)

    return {
      success: true,
      message: 'Chave API OpenAI removida com sucesso.',
    }
  }
  catch (error) {
    console.error('Erro ao remover a chave API:', error)
  }
})

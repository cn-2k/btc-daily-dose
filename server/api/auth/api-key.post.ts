// server/api/auth/api-key.post.ts
import { setUserApiKey } from '../../utils/apiKey'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  try {
    const { apiKey } = await readBody(event)

    if (!apiKey) {
      throw createError({
        statusCode: 400,
        message: 'A chave API é obrigatória.',
      })
    }

    // Salvar a chave na sessão do usuário
    await setUserApiKey(event, apiKey)

    return {
      success: true,
      message: 'Chave API OpenAI configurada com sucesso.',
    }
  }
  catch (error) {
    console.error('Erro ao salvar a chave API:', error)
  }
})

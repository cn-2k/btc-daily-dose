export default defineEventHandler(async (event) => {
  // Determinar a ação com base no método HTTP
  const method = event.node.req.method

  // GET: Verificar se existe uma chave API
  if (method === 'GET') {
    const apiKey = getCookie(event, 'openai_api_key')
    return { hasKey: !!apiKey }
  }

  // POST: Salvar uma nova chave API
  if (method === 'POST') {
    const { apiKey } = await readBody(event)

    if (!apiKey) {
      throw createError({
        statusCode: 400,
        message: 'A chave API é obrigatória.',
      })
    }

    // Salvar em cookie HTTP-only para segurança
    setCookie(event, 'openai_api_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
      sameSite: 'strict',
    })

    return {
      success: true,
      message: 'Chave API OpenAI configurada com sucesso.',
    }
  }

  // DELETE: Remover a chave API
  if (method === 'DELETE') {
    deleteCookie(event, 'openai_api_key')

    return {
      success: true,
      message: 'Chave API OpenAI removida com sucesso.',
    }
  }

  // Método não suportado
  throw createError({
    statusCode: 405,
    message: 'Método não permitido',
  })
})

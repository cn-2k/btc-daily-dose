export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      apiKey: providedApiKey = null, // apiKey é opcional aqui
      messages,
      images = [],
      model,
      max_tokens,
      temperature,
    } = body

    // Se não foi fornecida uma chave (chamada do cliente), busca do cookie
    let apiKey = providedApiKey

    if (!apiKey) {
      apiKey = getCookie(event, 'openai_api_key')

      if (!apiKey) {
        throw createError({
          statusCode: 401,
          message: 'Chave API OpenAI não configurada.',
        })
      }
    }

    // Preparar as mensagens para o modelo
    const apiMessages = messages.map((msg: any) => {
      // Verificar se esta mensagem contém imagens para anexar
      if (msg.role === 'user' && images.length > 0) {
        return {
          role: msg.role,
          content: [
            { type: 'text', text: msg.content },
            ...images.map((image: string) => ({
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            })),
          ],
        }
      }

      // Mensagem regular sem imagens
      return msg
    })

    // Configurar a solicitação para a OpenAI
    const openaiConfig = useRuntimeConfig()
    const openaiUrl = 'https://api.openai.com/v1/chat/completions'

    // Fazer a solicitação para a API da OpenAI
    const openaiResponse = await $fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || openaiConfig.public.openaiModel,
        messages: apiMessages,
        max_tokens: max_tokens || openaiConfig.public.openaiMaxTokens,
        temperature: temperature || 0.7,
      }),
    })

    // Extrair e retornar o conteúdo da resposta
    const content = openaiResponse.choices?.[0]?.message?.content || ''

    return {
      success: true,
      content,
    }
  }
  catch (error: any) {
    console.error('Erro ao chamar a API OpenAI:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao chamar a API OpenAI',
    })
  }
})

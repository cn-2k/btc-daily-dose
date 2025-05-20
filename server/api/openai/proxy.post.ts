// server/api/openai/proxy.post.ts
import OpenAI from 'openai'

// TODO: validate w/ zod
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      apiKey,
      model,
      max_tokens,
      temperature,
      messages,
      images = [], // Array de imagens em base64 (opcional)
    } = body

    if (!apiKey) {
      throw createError({
        statusCode: 400,
        message: 'Chave API é obrigatória.',
      })
    }

    if (!messages || !Array.isArray(messages)) {
      throw createError({
        statusCode: 400,
        message: 'Messages é obrigatório e deve ser um array.',
      })
    }

    // Criar cliente OpenAI com a chave do usuário
    const openai = new OpenAI({
      apiKey,
    })

    // Processar as mensagens e inserir imagens se necessário
    const processedMessages = messages.map((msg) => {
      // Se não for a mensagem do usuário ou não houver imagens, retorna a mensagem original
      if (msg.role !== 'user' || images.length === 0) {
        return msg
      }

      // Se for a mensagem do usuário e houver imagens, adiciona as imagens ao conteúdo
      const content = Array.isArray(msg.content) ? [...msg.content] : [{ type: 'text', text: msg.content }]

      // Adicionar imagens como conteúdo
      images.forEach((img: string) => {
        content.push({
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${img}`,
          },
        })
      })

      return {
        ...msg,
        content,
      }
    })

    // Fazer a chamada à API da OpenAI
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      max_tokens: max_tokens || 4000,
      temperature: temperature || 0.8,
      n: 1,
      messages: processedMessages,
    })

    // Retornar apenas o conteúdo da resposta para simplificar
    return {
      success: true,
      content: response.choices[0]?.message?.content,
      response, // Incluir a resposta completa para caso o cliente precise
    }
  }
  catch (error) {
    console.error('Erro na chamada à API OpenAI:', error)
  }
})

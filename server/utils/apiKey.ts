// server/utils/apiKey.ts
import type { H3Event } from 'h3'

/**
 * Obtém a chave API OpenAI do usuário a partir de várias fontes possíveis
 * Ordem de prioridade: Sessão > Cookie > Local Storage > Runtime Config
 */
export async function getUserApiKey(event: H3Event): Promise<string | null> {
  // 2. Verificar nos cookies
  const cookies = parseCookies(event)
  if (cookies['openai_api_key']) {
    return cookies['openai_api_key']
  }

  // 3. Usar a chave de configuração como fallback
  const config = useRuntimeConfig()
  if (config.openaiApiKey) {
    return config.openaiApiKey
  }

  return null
}

/**
 * Define a chave API na sessão do usuário
 */
export async function setUserApiKey(event: H3Event, apiKey: string): Promise<void> {
  // Também salva em um cookie para acesso mais fácil
  setCookie(event, 'openai_api_key', apiKey, {
    httpOnly: true, // Não acessível via JavaScript no navegador
    secure: process.env.NODE_ENV === 'production', // Só envia via HTTPS em produção
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
  })
}

/**
 * Remove a chave API da sessão do usuário
 */
export async function clearUserApiKey(event: H3Event): Promise<void> {
  // Remove o cookie também
  deleteCookie(event, 'openai_api_key')
}

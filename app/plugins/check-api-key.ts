export default defineNuxtPlugin({
  name: 'check-api-key',
  enforce: 'pre', // executa antes de outros plugins
  async setup(nuxtApp) {
    // Só execute no lado do cliente e apenas uma vez na inicialização
    if (import.meta.client) {
      const { checkApiKey } = useApiKey()

      // Verificar chave API na inicialização
      await checkApiKey().catch(e => console.error('Falha ao verificar API key:', e))

      // Verificar novamente quando o usuário navega entre páginas
      nuxtApp.hook('page:finish', async () => {
        await checkApiKey().catch(console.error)
      })
    }
  },
})

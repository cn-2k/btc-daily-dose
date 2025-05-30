<template>
  <section>
    <div class="py-8 px-4 mx-auto max-w-screen-2xl lg:py-10 lg:px-6">
      <AppHeader />
      <div class="flex flex-col lg:flex-row justify-between gap-4 items-center mb-3 w-full">
        <!-- BTC Liquidity Button -->
        <UButton
          label="BTC Liquidity Map"
          color="amber"
          variant="outline"
          active-variant="subtle"
          icon="i-material-symbols:currency-bitcoin"
          block
          size="xl"
          :active="isActiveSource('heatmap')"
          :disabled="isLoading"
          @click="handleAnalyze('heatmap')"
        />

        <!-- TradingView Chart Button -->
        <UButton
          label="TradingView Chart"
          color="info"
          variant="outline"
          active-variant="subtle"
          icon="i-simple-icons-tradingview"
          size="xl"
          block
          :active="isActiveSource('tradingview')"
          :disabled="isLoading"
          @click="handleAnalyze('tradingview')"
        />

        <!-- Chart + Map Button -->
        <UButton
          label="Chart + Liquidity"
          color="success"
          icon="i-material-symbols:auto-graph"
          variant="outline"
          active-variant="subtle"
          size="xl"
          block
          :active="isActiveSource('general')"
          :disabled="isLoading"
          @click="handleAnalyze('general')"
        />
      </div>

      <!-- Cards de descrição com transição de fade -->
      <transition-group
        v-if="!analysisResult && !isLoading"
        name="fade"
        tag="div"
        class="grid grid-cols-1 lg:grid-cols-3 text-justify gap-6"
      >
        <DescriptionCard
          v-for="(item, idx) in cardsDescriptionMap"
          :key="idx"
          :content="item.content"
          :icon="item.icon"
          :tags="item.tags"
          :color-scheme="item.color"
        />
      </transition-group>

      <ClientOnly>
        <!-- Loading state com transição -->
        <transition
          name="fade"
          mode="out-in"
        >
          <RealtimeUpdates
            v-if="isLoading"
            key="loading"
            initial-message="Analisando dados do Bitcoin..."
          />

          <!-- Error state com transição -->
          <UAlert
            v-else-if="error"
            key="error"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            title="Erro na análise"
            :description="error"
            class="mb-4 mt-4"
          />

          <!-- Resultado com transição -->
          <UCard
            v-else-if="analysisResult"
            key="result"
            variant="subtle"
            class="mt-10"
            :ui="{ body: 'h-[400px] xl:h-[650px] overflow-y-auto' }"
          >
            <MarkdownRenderer
              :source="analysisResult.response"
            />
          </UCard>
        </transition>
      </ClientOnly>
    </div>
    <ChatWidget />
    <UModal
      v-model:open="openModal"
      title="Deseja refazer a análise?"
      close-icon="i-mdi:close"
    >
      <template #body>
        <div class="h-full justify-center items-center flex flex-col gap-10 m-4">
          <UAlert
            color="info"
            variant="subtle"
            description="Deseja fazer uma nova análise? Isso irá iniciar um novo processo e apagará a análise atual."
          />
          <div class="flex gap-2">
            <UButton
              label="Cancelar"
              color="neutral"
              variant="subtle"
              @click="openModal = false"
            />
            <UButton
              label="Refazer"
              color="success"
              variant="subtle"
              @click="handleAnalyze(activeSource!, true); openModal = false"
            />
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { useAnalysis } from '@/composables/useAnalysis'
import type { AnalysisSource } from '@/types/analysis'
import DescriptionCard from '@/components/analysis/DescriptionCard.vue'

useHead({
  bodyAttrs: {
    class: 'bg-stone-100 dark:bg-neutral-900',
  },
})

useSeoMeta({
  title: 'BTC Daily Dose',
  description: 'Explore análises detalhadas do Bitcoin, incluindo mapa de liquidações e gráficos do TradingView.',
})

interface CardsDescriptionProps {
  content: string
  icon: string
  tags: string[]
  color: 'amber' | 'blue' | 'green' | 'red' | 'purple' | 'indigo' | 'pink' | undefined
}

const { isLoading, analysisResult, error, analyzeGeneral, analyzeSingleSource, isActiveSource, activeSource } = useAnalysis()
const { hasApiKey } = useApiKey()
const toast = useToast()
const openModal = ref<boolean>(false)

/**
 * Gerencia os diferentes tipos de análise com base na fonte
 */

/**
 * Gerencia os diferentes tipos de análise com base na fonte
 */
const handleAnalyze = async (source: AnalysisSource, redo?: boolean) => {
  if (!hasApiKey.value) {
    toast.add({
      title: 'Chave de API não configurada!',
      description: 'Você precisa definir uma chave de API nas configurações.',
      icon: 'i-mdi-alert',
      color: 'error',
    })
    return
  }

  // CORREÇÃO: Verificar se já existe resultado E se o botão clicado é o mesmo que está ativo
  if (analysisResult.value && !redo && activeSource.value === source) {
    // Só mostra o modal se clicar no mesmo botão que já está ativo
    openModal.value = true
    return
  }

  // Se clicar em um botão diferente do ativo, executa diretamente a nova análise
  if (source === 'general') {
    await analyzeGeneral()
  }
  else {
    await analyzeSingleSource(source)
  }
}

const cardsDescriptionMap: CardsDescriptionProps[] = [
  {
    content: 'Análise do mapa de calor do Bitcoin na plataforma Coinglass, identificando pontos críticos de liquidação. Visualize onde grandes ordens estão posicionadas e tome decisões mais assertivas.',
    icon: 'i-material-symbols:currency-bitcoin',
    tags: ['Liquidação', 'Coinglass'],
    color: 'amber',
  },
  {
    content: 'Análise detalhada do gráfico diário do Bitcoin diretamente do TradingView. Obtenha insights valiosos sobre o price action, tendências e possíveis movimentos futuros do ativo.',
    icon: 'i-simple-icons-tradingview',
    tags: ['Análise Técnica', 'Price Action'],
    color: 'blue',
  },
  {
    content: 'Análise completa que combina o gráfico do TradingView com o mapa de liquidações. Visualize simultaneamente o price action e os pontos de liquidação para uma estratégia de trading mais abrangente.',
    icon: 'i-material-symbols:auto-graph',
    tags: ['Análise Completa', 'Visão Integrada'],
    color: 'green',
  },
]
</script>

<style scoped>
/* Estilos para a transição de fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Estilos específicos para transition-group */
.fade-move {
  transition: transform 0.5s ease;
}
</style>

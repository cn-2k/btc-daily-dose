<template>
  <div class="flex items-center gap-2">
    <UButtonGroup size="xl">
      <UBadge
        icon="i-mdi-bitcoin"
        color="neutral"
        variant="outline"
      >
        <div
          class="font-bold transition-colors"
          :class="{ 'text-green-500': priceIncreased, 'text-red-500': priceDecreased }"
        >
          {{ formatCurrency(currentPrice) }}
        </div>
      </UBadge>

      <UTooltip
        text="Atualizar conexão"
        :delay-duration="0"
        :content="{ side: 'top' }"
        disable-hoverable-content
      >
        <UButton
          icon="i-material-symbols-sync-rounded"
          variant="outline"
          color="neutral"
          :loading="isUpdating"
          @click="updateConnection"
        />
      </UTooltip>

      <UTooltip
        :text="hasApiKey ? 'API configurada' : 'Configurar API'"
        :delay-duration="0"
        :content="{ side: 'top' }"
        disable-hoverable-content
      >
        <UButton
          :icon="hasApiKey ? 'i-material-symbols-light:check-circle' : 'i-material-symbols-light:settings'"
          variant="outline"
          :color="hasApiKey ? 'success' : 'neutral'"
          :loading="isUpdating"
          @click="openDialog = true"
        />
      </UTooltip>
    </UButtonGroup>
  </div>

  <UModal
    v-model:open="openDialog"
    :dismissible="false"
    title="Inserir chave de API"
    description="Insira sua chave de API da OpenAI"
    :ui="{ footer: 'justify-end' }"
  >
    <template #title>
      <p>Inserir chave de API</p>
    </template>

    <template #body>
      <div>
        <UFormField
          label="Chave API"
        >
          <UInput
            v-model="apiKey"
            class="w-full"
            :placeholder="hasApiKey ? '••••••••••••••••••••••' : 'sk-...'"
            icon="i-mdi-key"
          />
        </UFormField>
        <p class="text-xs text-end mt-2 text-gray-300/80">
          <span v-if="!hasApiKey">Você consegue obter sua chave clicando <NuxtLink
            class="text-blue-400 font-bold underline"
            href="https://platform.openai.com/api-keys"
            target="_blank"
          >aqui</NuxtLink>.</span>
          <span
            v-else
            class="text-green-500 font-medium flex items-center justify-end gap-1"
          ><UIcon
            name="i-material-symbols:check-circle"
            size="14"
          /> Chave de API configurada!</span>
        </p>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Fechar"
        color="neutral"
        variant="outline"
        @click="openDialog = false"
      />
      <UButton
        v-if="hasApiKey"
        label="Remover chave"
        color="error"
        :disabled="!apiKey"
        variant="outline"
        @click="clearApiKey"
      />
      <UButton
        :label="hasApiKey ? 'Salvar' : 'Configurar'"
        :disabled="!apiKey"
        color="success"
        @click="saveApiKey(apiKey)"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useBTCPrice } from '@/composables/useBTCPrice'
import { useApiKey } from '@/composables/useApiKey'

const openDialog = ref<boolean>(false)

const { currentPrice, formatCurrency, isUpdating, priceDecreased, priceIncreased, updateConnection } = useBTCPrice()
const { apiKey, clearApiKey, hasApiKey, saveApiKey } = useApiKey()
</script>

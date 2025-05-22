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
          label="Insira a chave API"
        >
          <UInput
            v-model="apiKey"
            :placeholder="hasApiKey ? '••••••••••••••••••••••••••••••••••••••••••••' : 'sk-...'"
            :type="show ? 'text' : 'password'"
            :disabled="hasApiKey"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
            icon="i-mdi-key"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                :disabled="hasApiKey"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>
        <div class="flex flex-col justify-end items-end gap-2">
          <p class="text-xs mt-2 text-gray-300/80">
            <span v-if="!hasApiKey">Você consegue obter sua chave clicando <NuxtLink
              class="text-blue-400 font-bold underline"
              href="https://platform.openai.com/api-keys"
              target="_blank"
            >aqui</NuxtLink>.</span>
            <span
              v-else
              class="text-green-500 font-medium flex items-center gap-1"
            ><UIcon
              name="i-material-symbols:check-circle"
              size="14"
            /> Chave de API configurada!</span>
          </p>
          <UButton
            v-if="hasApiKey"
            label="Remover chave de API"
            color="error"
            size="xs"
            variant="outline"
            @click="clearApiKey()"
          />
        </div>
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
        :label="hasApiKey ? 'Salvar' : 'Configurar'"
        :disabled="!apiKey"
        color="success"
        @click="validateApiKey(apiKey)"
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
const toast = useToast()
const show = ref<boolean>(false)

const validateApiKey = (key: string) => {
  if (!key.startsWith('sk-')) {
    toast.add({
      title: 'Poxa, alguma coisa deu errado',
      description: 'A chave API deve começar com \'sk-\'',
      icon: 'i-mdi-alert',
      color: 'error',
    })
    return
  }

  if (key.length < 15) {
    toast.add({
      title: 'Poxa, alguma coisa deu errado',
      description: 'A chave API parece ser muito curta',
      icon: 'i-mdi-alert',
      color: 'error',
    })
    return
  }

  saveApiKey(key)
}
</script>

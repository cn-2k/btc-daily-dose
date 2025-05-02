<template>
  <div class="flex flex-col justify-center items-center gap-4 py-28">
    <UIcon
      name="i-mdi-bitcoin"
      class="size-28 text-[#F7931A] animate-spin"
    />
    <h2 class="text-xl">
      {{ message || 'Analisando, um momento...' }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

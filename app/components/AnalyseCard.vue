<template>
  <div class="relative">
    <UCard
      :ui="{ body: 'h-[400px] 2xl:h-[600px] overflow-y-auto' }"
      variant="subtle"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ props.title }}
          </h3>
          <slot name="headerIcon" />
        </div>
      </template>

      <div class="prose prose-invert max-w-none pb-14">
        <MarkdownRenderer
          v-if="props.content"
          :source="props.content"
        />
        <slot name="content" />
        <!-- Add more content here -->
      </div>

      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-900" />
    </UCard>

    <!-- Overlay Loader -->
    <Transition name="fade">
      <div
        v-if="props.loading"
        class="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10"
        @touchmove.prevent
      >
        <UIcon
          name="i-svg-spinners:90-ring"
          class="size-10 text-neutral-500"
        />
        <span class="text-neutral-300 tracking-tight font-light loading-dots">Carregando análise</span>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  loading: boolean
  title?: string
  content?: string
}>()
</script>

<style>
@keyframes dots {
  0% {
    content: "";
  }

  33% {
    content: ".";
  }

  66% {
    content: "..";
  }

  100% {
    content: "...";
  }
}

.loading-dots::after {
  content: "";
  animation: dots 1.2s steps(4, end) infinite;
  display: inline-block;
  width: 1em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

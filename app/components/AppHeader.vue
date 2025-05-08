<template>
  <div class="mb-8 lg:flex-row flex flex-col justify-between items-center gap-4">
    <div class="flex justify-center items-center gap-4">
      <span class="bg-gradient-to-r flex justify-center items-center from-amber-500 to-amber-600 p-2 rounded-full text-black">
        <UIcon
          name="i-material-symbols:currency-bitcoin"
          size="28"
        />
      </span>
      <p class="font-bold tracking-tight text-2xl text-neutral-200">
        Daily Dose
      </p>
    </div>

    <BitcoinPriceTracker />
  </div>
</template>

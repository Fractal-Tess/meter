<script lang="ts">
  import { Radio } from '@lucide/svelte/icons';
  import { sensorData } from '$lib/stores/data.svelte.js';
</script>

<header class="flex items-center justify-between gap-3">
  <!-- Left: brand cluster -->
  <div class="flex items-center gap-2.5 md:gap-3 min-w-0">
    <div class="relative shrink-0">
      <div
        class="w-8 h-8 md:w-10 md:h-10 rounded-lg glass-panel flex items-center justify-center"
      >
        <Radio
          class="w-3.5 h-3.5 md:w-4.5 md:h-4.5"
          style="color: var(--temp-color);"
        />
      </div>
      {#if !sensorData.isLoading.stats}
        <span class="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span
            class="pulse-dot absolute inline-flex h-full w-full rounded-full opacity-75"
            style="background: oklch(0.75 0.18 150);"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2"
            style="background: oklch(0.75 0.18 150);"
          ></span>
        </span>
      {/if}
    </div>

    <div class="min-w-0">
      <h1
        class="text-base md:text-xl font-semibold tracking-tight truncate"
        style="letter-spacing: -0.02em;"
      >
        Sensor Dashboard
      </h1>
      <p
        class="text-[11px] md:text-xs truncate"
        style="color: var(--muted-foreground);"
      >
        Real-time temperature & humidity
      </p>
    </div>
  </div>
</header>

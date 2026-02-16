<script lang="ts">
  import { Wifi, WifiOff, RefreshCw, Clock } from '@lucide/svelte/icons';
  import * as m from '$lib/paraglide/messages.js';
  import { sensorData } from '@/lib/stores/data.svelte';

  let isConnected = $state(true);
  let lastUpdate = $state(new Date());

  $effect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        isConnected = false;
        setTimeout(() => {
          isConnected = true;
        }, 2000);
      }
      lastUpdate = new Date();
    }, 5000);

    return () => clearInterval(interval);
  });

  let formattedTime = $derived(lastUpdate.toLocaleTimeString());
</script>

<footer
  class="flex items-center justify-between gap-3 rounded-xl glass-panel px-3 md:px-4 py-2 md:py-2.5"
>
  <!-- Left: connection status -->
  <div class="flex items-center gap-2">
    {#if isConnected}
      <div class="relative flex items-center gap-1.5">
        <span class="relative flex h-2 w-2">
          <span
            class="pulse-dot absolute inline-flex h-full w-full rounded-full"
            style="background: oklch(0.75 0.18 150 / 60%);"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2"
            style="background: oklch(0.75 0.18 150);"
          ></span>
        </span>
        <Wifi class="h-3 w-3 md:h-3.5 md:w-3.5" style="color: oklch(0.75 0.18 150);" />
        <span
          class="text-[11px] md:text-xs font-medium"
          style="color: oklch(0.75 0.18 150);"
        >
          {m['status.connected']()}
        </span>
      </div>
    {:else}
      <div class="flex items-center gap-1.5">
        <span class="relative flex h-2 w-2">
          <span
            class="relative inline-flex rounded-full h-2 w-2"
            style="background: var(--destructive);"
          ></span>
        </span>
        <WifiOff class="h-3 w-3 md:h-3.5 md:w-3.5" style="color: var(--destructive);" />
        <span
          class="text-[11px] md:text-xs font-medium"
          style="color: var(--destructive);"
        >
          {m['status.disconnected']()}
        </span>
      </div>
    {/if}
  </div>

  <!-- Center: refresh indicator -->
  {#if sensorData.isRefreshing}
    <div class="flex items-center gap-1.5">
      <RefreshCw
        class="h-3 w-3 spin-refresh"
        style="color: var(--muted-foreground);"
      />
      <span
        class="text-[11px] md:text-xs hidden sm:inline"
        style="color: var(--muted-foreground);"
      >
        Syncing...
      </span>
    </div>
  {/if}

  <!-- Right: last update timestamp -->
  <div class="flex items-center gap-1.5">
    <Clock class="h-3 w-3" style="color: var(--muted-foreground);" />
    <span
      class="text-[11px] md:text-xs tabular-nums"
      style="color: var(--muted-foreground); font-family: 'JetBrains Mono', monospace;"
    >
      {m['lastUpdate.title']()}: {formattedTime}
    </span>
  </div>
</footer>

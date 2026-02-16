<script lang="ts">
  import { Wifi, WifiOff, RefreshCw, Clock } from '@lucide/svelte/icons';
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
  class="flex items-center justify-between gap-2 rounded-lg md:rounded-xl glass-panel px-2.5 md:px-4 py-1.5 md:py-2"
>
  <div class="flex items-center gap-1.5">
    {#if isConnected}
      <span class="relative flex h-1.5 w-1.5">
        <span
          class="pulse-dot absolute inline-flex h-full w-full rounded-full"
          style="background: oklch(0.75 0.18 150 / 60%);"
        ></span>
        <span
          class="relative inline-flex rounded-full h-1.5 w-1.5"
          style="background: oklch(0.75 0.18 150);"
        ></span>
      </span>
      <Wifi class="h-2.5 w-2.5 md:h-3 md:w-3" style="color: oklch(0.75 0.18 150);" />
      <span
        class="text-[10px] md:text-xs font-medium"
        style="color: oklch(0.75 0.18 150);"
      >Connected</span>
    {:else}
      <span
        class="inline-flex rounded-full h-1.5 w-1.5"
        style="background: var(--destructive);"
      ></span>
      <WifiOff class="h-2.5 w-2.5 md:h-3 md:w-3" style="color: var(--destructive);" />
      <span
        class="text-[10px] md:text-xs font-medium"
        style="color: var(--destructive);"
      >Disconnected</span>
    {/if}
  </div>

  {#if sensorData.isRefreshing}
    <div class="flex items-center gap-1">
      <RefreshCw
        class="h-2.5 w-2.5 spin-refresh"
        style="color: var(--muted-foreground);"
      />
      <span
        class="text-[10px] hidden sm:inline"
        style="color: var(--muted-foreground);"
      >Syncing...</span>
    </div>
  {/if}

  <div class="flex items-center gap-1">
    <Clock class="h-2.5 w-2.5 md:h-3 md:w-3" style="color: var(--muted-foreground);" />
    <span
      class="text-[10px] md:text-xs tabular-nums"
      style="color: var(--muted-foreground); font-family: 'JetBrains Mono', monospace;"
    >{formattedTime}</span>
  </div>
</footer>

<script lang="ts">
  import { Wifi, WifiOff, Activity } from '@lucide/svelte/icons';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import * as m from '$lib/paraglide/messages.js';

  let isConnected = $state(true);
  let lastUpdate = $state(new Date());

  // Simulate connection status updates
  $effect(() => {
    const interval = setInterval(() => {
      // Simulate occasional disconnections
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
</script>

<div class="flex items-center gap-2">
  <div class="flex items-center gap-2">
    {#if isConnected}
      <Wifi class="h-4 w-4 text-green-500" />
      <Badge
        variant="default"
        class="bg-green-100 text-green-800 hover:bg-green-100"
      >
        <Activity class="h-3 w-3 mr-1" />
        Connected
      </Badge>
    {:else}
      <WifiOff class="h-4 w-4 text-red-500" />
      <Badge variant="destructive">Disconnected</Badge>
    {/if}
  </div>

  <span class="text-sm text-muted-foreground">
    {m['lastUpdate.title']()}: {lastUpdate.toLocaleTimeString()}
  </span>
</div>

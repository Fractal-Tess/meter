<script lang="ts">
  import { onMount } from 'svelte';
  import { registerSW } from 'virtual:pwa-register';

  let updateSW: (() => void) | undefined;
  let needRefresh = $state(false);

  onMount(() => {
    updateSW = registerSW({
      onNeedRefresh() {
        needRefresh = true;
      },
    });
  });

  function close() {
    needRefresh = false;
  }

  function update() {
    updateSW?.();
    close();
  }
</script>

{#if needRefresh}
  <div
    class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium">New content available!</p>
        <p class="text-xs opacity-90">Click reload to update.</p>
      </div>
      <div class="flex gap-2 ml-4">
        <button
          onclick={update}
          class="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Reload
        </button>
        <button
          onclick={close}
          class="px-3 py-1 bg-transparent border border-white text-white rounded text-sm font-medium hover:bg-white hover:text-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

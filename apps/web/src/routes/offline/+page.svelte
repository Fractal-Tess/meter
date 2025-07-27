<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import * as m from '$lib/paraglide/messages.js';

  let isOnline = $state(false);

  onMount(() => {
    if (!browser) return;

    const updateOnlineStatus = () => {
      isOnline = navigator.onLine;
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  });

  function goHome() {
    goto('/');
  }

  function retry() {
    window.location.reload();
  }
</script>

<svelte:head>
  <title>{m['offline.title']()} - Meter Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
  <div class="max-w-md w-full text-center">
    <div class="mb-8">
      <div
        class="w-24 h-24 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
          ></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-foreground mb-2">
        {m['offline.title']()}
      </h1>
      <p class="text-muted-foreground">
        {m['offline.description']()}
      </p>
    </div>

    <div class="space-y-4">
      <button
        onclick={goHome}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {m['offline.goToDashboard']()}
      </button>

      {#if isOnline}
        <button
          onclick={retry}
          class="w-full bg-gray-200 dark:bg-gray-700 text-foreground py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {m['offline.retryConnection']()}
        </button>
      {/if}
    </div>

    <div class="mt-8 text-sm text-muted-foreground">
      <p>{m['offline.offlineMessage']()}</p>
    </div>
  </div>
</div>

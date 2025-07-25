<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let deferredPrompt: any = null;
  let showInstallPrompt = $state(false);
  let isIOS = $state(false);
  let isAndroid = $state(false);
  let isStandalone = $state(false);

  onMount(() => {
    if (!browser) return;

    // Check if already installed
    isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    isIOS = /iphone|ipad|ipod/.test(userAgent);
    isAndroid = /android/.test(userAgent);

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallPrompt = true;
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      showInstallPrompt = false;
      deferredPrompt = null;
    });
  });

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    deferredPrompt = null;
    showInstallPrompt = false;
  }

  function closePrompt() {
    showInstallPrompt = false;
  }
</script>

{#if showInstallPrompt && !isStandalone}
  <div
    class="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium">Install Meter Dashboard</p>
        <p class="text-xs opacity-90">
          {#if isIOS}
            Tap the share button and select "Add to Home Screen"
          {:else if isAndroid}
            Tap "Install" to add to your home screen
          {:else}
            Install this app for a better experience
          {/if}
        </p>
      </div>
      <div class="flex gap-2 ml-4">
        {#if !isIOS}
          <button
            onclick={installApp}
            class="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Install
          </button>
        {/if}
        <button
          onclick={closePrompt}
          class="px-3 py-1 bg-transparent border border-white text-white rounded text-sm font-medium hover:bg-white hover:text-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

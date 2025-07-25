<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let showInstructions = $state(false);
  let platform = $state('unknown');
  let isStandalone = $state(false);

  onMount(() => {
    if (!browser) return;

    // Check if already installed
    isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      platform = 'ios';
    } else if (/android/.test(userAgent)) {
      platform = 'android';
    } else if (/windows/.test(userAgent)) {
      platform = 'windows';
    } else if (/macintosh|mac os x/.test(userAgent)) {
      platform = 'mac';
    } else if (/linux/.test(userAgent)) {
      platform = 'linux';
    }
  });

  function closeInstructions() {
    showInstructions = false;
    dispatch('close');
  }

  function showInstallInstructions() {
    showInstructions = true;
  }

  function getInstructions() {
    switch (platform) {
      case 'ios':
        return {
          title: 'Install on iPhone/iPad',
          steps: [
            'Tap the Share button (square with arrow up)',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to confirm',
          ],
          icon: '📱',
        };
      case 'android':
        return {
          title: 'Install on Android',
          steps: [
            'Tap the menu button (three dots)',
            'Tap "Add to Home screen" or "Install app"',
            'Tap "Add" or "Install" to confirm',
          ],
          icon: '🤖',
        };
      case 'windows':
        return {
          title: 'Install on Windows',
          steps: [
            'Click the install icon in the address bar',
            'Or click the menu button and select "Install this site as an app"',
            'Click "Install" to confirm',
          ],
          icon: '🪟',
        };
      case 'mac':
        return {
          title: 'Install on Mac',
          steps: [
            'Click the install icon in the address bar',
            'Or go to File > Add to Dock',
            'Click "Install" to confirm',
          ],
          icon: '🍎',
        };
      default:
        return {
          title: 'Install App',
          steps: [
            'Look for an install button in your browser',
            'Or check the browser menu for "Install" options',
            'Follow the prompts to add to your device',
          ],
          icon: '💻',
        };
    }
  }

  const instructions = getInstructions();
</script>

{#if !isStandalone}
  <button
    onclick={showInstallInstructions}
    class="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      ></path>
    </svg>
    Install App
  </button>
{/if}

{#if showInstructions}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-lg font-semibold text-foreground flex items-center gap-2"
        >
          <span class="text-2xl">{instructions.icon}</span>
          {instructions.title}
        </h3>
        <button
          onclick={closeInstructions}
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="space-y-3 mb-6">
        {#each instructions.steps as step, index}
          <div class="flex items-start gap-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
            >
              {index + 1}
            </div>
            <p class="text-sm text-foreground">{step}</p>
          </div>
        {/each}
      </div>

      <div class="flex justify-end">
        <button
          onclick={closeInstructions}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  </div>
{/if}

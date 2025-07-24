<script lang="ts">
  import { page } from '$app/state';
  import { setLocale } from '$lib/paraglide/runtime';
  import PWA from '$lib/components/PWA.svelte';
  import InstallPrompt from '$lib/components/InstallPrompt.svelte';
  import '../app.css';

  const { children } = $props();

  // Initialize language from URL parameter or default to 'en'
  $effect(() => {
    const lang = page.url.searchParams.get('lang') || 'bg';
    setLocale(lang as 'en' | 'bg');
  });
</script>

<main>
  {@render children?.()}
</main>

<PWA />
<InstallPrompt />

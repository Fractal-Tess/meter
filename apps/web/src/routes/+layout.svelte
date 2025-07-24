<script lang="ts">
  import { page } from '$app/state';
  import { setLocale } from '$lib/paraglide/runtime';
  import '../app.css';

  const { children } = $props();

  // Initialize language from URL parameter or default to 'en'
  $effect(() => {
    const lang = page.url.searchParams.get('lang') || 'en';
    setLocale(lang as 'en' | 'bg', { reload: false });
  });
</script>

<main>
  {@render children?.()}
</main>

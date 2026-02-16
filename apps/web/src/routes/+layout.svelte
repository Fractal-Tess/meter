<script lang="ts">
  import PWA from '$lib/components/PWA.svelte';
  import InstallPrompt from '$lib/components/InstallPrompt.svelte';
  import '../app.css';

  const { children } = $props();
</script>

<main>
  {@render children?.()}
</main>

<PWA />
<InstallPrompt />

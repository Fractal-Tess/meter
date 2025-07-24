<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { setLanguageTag } from '$lib/paraglide/runtime';
	import '../app.css';

	// Initialize language from URL parameter or default to 'en'
	onMount(() => {
		const lang = $page.url.searchParams.get('lang') || 'en';
		setLanguageTag(lang as any);
	});
</script>

<main>
	<slot />
</main>

<script lang="ts">
	import { availableLanguageTags, languageTag, setLanguageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Globe } from '@lucide/svelte';

	let showDropdown = $state(false);

	const languages = {
		en: 'English',
		bg: 'Български'
	};

	function switchLanguage(newLang: string) {
		setLanguageTag(newLang as any);
		showDropdown = false;
		
		// Update URL to reflect language change
		const url = new URL($page.url);
		url.searchParams.set('lang', newLang);
		goto(url.toString(), { replaceState: true });
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: Event) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			showDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="language-switcher relative">
	<button
		onclick={toggleDropdown}
		class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
		aria-label="Switch language"
	>
		<Globe class="h-4 w-4" />
		<span>{languages[languageTag()]}</span>
		<svg
			class="h-4 w-4 transition-transform {showDropdown ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if showDropdown}
		<div
			class="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
		>
			{#each availableLanguageTags as lang}
				<button
					onclick={() => switchLanguage(lang)}
					class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg {lang === languageTag() ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}"
				>
					{languages[lang]}
				</button>
			{/each}
		</div>
	{/if}
</div> 
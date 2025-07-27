<script lang="ts">
  import { Globe } from '@lucide/svelte/icons';
  import * as m from '$lib/paraglide/messages.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
  ];

  function toggleLanguage() {
    const currentLang = page.url.searchParams.get('lang') || 'en';
    const newLang = currentLang === 'en' ? 'bg' : 'en';
    const url = new URL(page.url);
    url.searchParams.set('lang', newLang);
    goto(url.toString());
  }

  let currentLanguage = $derived(
    languages.find(
      (lang) => lang.code === (page.url.searchParams.get('lang') || 'en')
    )
  );
</script>

<div class="flex gap-2 md:gap-4 justify-between">
  <div class="space-y-0.5 md:space-y-1">
    <h1 class="text-xl md:text-3xl font-bold tracking-tight">
      {m['dashboard.title']()}
    </h1>
    <p class="text-xs md:text-sm text-muted-foreground">
      {m['dashboard.subtitle']()}
    </p>
  </div>

  <div class="flex items-center gap-2 md:gap-3">
    <button
      class="inline-flex h-7 md:h-9 items-center gap-1 md:gap-2 rounded-md border border-input bg-background px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onclick={toggleLanguage}
      title="Toggle language"
    >
      <Globe class="h-3 w-3 md:h-4 md:w-4" />
      <span>{currentLanguage?.flag}</span>
      <span class="hidden sm:inline">{currentLanguage?.name}</span>
    </button>
  </div>
</div>

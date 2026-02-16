<script lang="ts">
  import { Globe, Radio } from '@lucide/svelte/icons';
  import * as m from '$lib/paraglide/messages.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { sensorData } from '$lib/stores/data.svelte.js';

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

<header class="flex items-start justify-between gap-4">
  <!-- Left: brand cluster -->
  <div class="flex items-center gap-3 md:gap-4 min-w-0">
    <!-- Ambient sensor icon -->
    <div class="relative shrink-0">
      <div
        class="w-9 h-9 md:w-11 md:h-11 rounded-xl glass-panel flex items-center justify-center"
        style="border-color: var(--glass-border);"
      >
        <Radio
          class="w-4 h-4 md:w-5 md:h-5"
          style="color: var(--temp-color);"
        />
      </div>
      <!-- Live indicator dot -->
      {#if !sensorData.isLoading.stats}
        <span class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span
            class="pulse-dot absolute inline-flex h-full w-full rounded-full opacity-75"
            style="background: oklch(0.75 0.18 150);"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2.5 w-2.5"
            style="background: oklch(0.75 0.18 150);"
          ></span>
        </span>
      {/if}
    </div>

    <div class="min-w-0">
      <h1
        class="text-lg md:text-2xl font-semibold tracking-tight truncate"
        style="letter-spacing: -0.02em;"
      >
        {m['dashboard.title']()}
      </h1>
      <p
        class="text-xs md:text-sm truncate"
        style="color: var(--muted-foreground);"
      >
        {m['dashboard.subtitle']()}
      </p>
    </div>
  </div>

  <!-- Right: language toggle -->
  <button
    class="shrink-0 inline-flex h-9 md:h-10 items-center gap-2 rounded-xl glass-panel px-3 md:px-4 text-xs md:text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
    style="color: var(--muted-foreground);"
    onclick={toggleLanguage}
    title="Toggle language"
  >
    <Globe class="h-3.5 w-3.5 md:h-4 md:w-4 opacity-60" />
    <span>{currentLanguage?.flag}</span>
    <span class="hidden sm:inline">{currentLanguage?.name}</span>
  </button>
</header>

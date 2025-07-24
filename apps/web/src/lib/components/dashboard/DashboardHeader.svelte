<script lang="ts">
  import { RefreshCw, Globe } from '@lucide/svelte/icons';
  import * as m from '$lib/paraglide/messages.js';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import {
    refreshAllData,
    updateTimeRange,
    sensorData,
  } from '$lib/stores/data.svelte.js';

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
  ];

  async function handleRefresh() {
    await refreshAllData();
  }

  async function handleTimeRangeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    await updateTimeRange(target.value);
  }

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

<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div class="space-y-1">
    <h1 class="text-3xl font-bold tracking-tight">{m['dashboard.title']()}</h1>
    <p class="text-muted-foreground">
      {m['dashboard.subtitle']()}
    </p>
  </div>

  <div class="flex items-center gap-3">
    <select
      class="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={sensorData.timeRange}
      onchange={handleTimeRangeChange}
    >
      {#each timeRanges as range}
        <option value={range.value}>{range.label}</option>
      {/each}
    </select>

    <button
      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      onclick={handleRefresh}
      disabled={sensorData.isRefreshing}
    >
      <RefreshCw
        class="h-4 w-4 {sensorData.isRefreshing ? 'animate-spin' : ''}"
      />
    </button>

    <button
      class="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onclick={toggleLanguage}
      title="Toggle language"
    >
      <Globe class="h-4 w-4" />
      <span>{currentLanguage?.flag}</span>
      <span class="hidden sm:inline">{currentLanguage?.name}</span>
    </button>
  </div>
</div>

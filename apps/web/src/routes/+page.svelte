<script lang="ts">
  import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
  import StatsCards from '$lib/components/dashboard/StatsCards.svelte';
  import SensorChart from '$lib/components/dashboard/SensorChart.svelte';
  import StatusIndicator from '$lib/components/dashboard/StatusIndicator.svelte';
  import { initialize } from '$lib/stores/data.svelte.js';

  $effect(() => {
    initialize();
  });
</script>

<svelte:head>
  <title>Meter</title>
  <meta
    name="description"
    content="A simple dashboard to monitor the temperature and humidity of a room."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="noise-overlay">
  <main
    class="relative min-h-svh md:h-svh overflow-hidden ambient-mesh"
    style="font-family: 'Outfit', sans-serif;"
  >
    <div
      class="relative z-10 mx-auto max-w-7xl flex flex-col h-full py-4 md:py-5 lg:py-6 px-4 md:px-6 gap-4 md:gap-5"
    >
      <!-- Header row: title + status + language -->
      <div class="stagger-in" style="animation-delay: 0ms;">
        <DashboardHeader />
      </div>

      <!-- Stats row -->
      <div class="stagger-in" style="animation-delay: 80ms;">
        <StatsCards />
      </div>

      <!-- Hero chart -->
      <div class="stagger-in flex-1 min-h-0" style="animation-delay: 160ms;">
        <SensorChart />
      </div>

      <!-- Bottom status bar -->
      <div class="stagger-in" style="animation-delay: 240ms;">
        <StatusIndicator />
      </div>
    </div>
  </main>
</div>

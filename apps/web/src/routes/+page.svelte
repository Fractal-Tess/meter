<script lang="ts">
  import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
  import StatsCards from '$lib/components/dashboard/StatsCards.svelte';
  import SensorChart from '$lib/components/dashboard/SensorChart.svelte';
  import StatusIndicator from '$lib/components/dashboard/StatusIndicator.svelte';
  import { initialize } from '$lib/stores/data.svelte.js';

  // Initialize data and start auto-refresh
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
</svelte:head>

<main class="md:h-svh">
  <div
    class="container mx-auto max-w-7xl space-y-4 md:space-y-6 flex flex-col py-4 md:py-6 lg:py-8 px-4 md:px-6 h-full overflow-hidden"
  >
    <!-- Dashboard Header -->
    <DashboardHeader />

    <!-- Status Indicator -->
    <StatusIndicator />

    <!-- Stats Cards -->
    <StatsCards />

    <!-- Main Chart -->
    <SensorChart />
  </div>
</main>

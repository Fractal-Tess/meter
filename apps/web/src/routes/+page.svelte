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

<main class="h-screen">
  <div
    class="container mx-auto max-w-7xl space-y-6 flex flex-col max-h-full overflow-hidden h-full py-4 md:py-6 lg:py-8"
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

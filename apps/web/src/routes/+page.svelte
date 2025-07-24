<script lang="ts">
  import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
  import StatsCards from '$lib/components/dashboard/StatsCards.svelte';
  import SensorChart from '$lib/components/dashboard/SensorChart.svelte';
  import StatusIndicator from '$lib/components/dashboard/StatusIndicator.svelte';
  import {
    initializeData,
    startAutoRefresh,
    cleanup,
  } from '$lib/stores/data.svelte.js';

  // Initialize data and start auto-refresh
  $effect(() => {
    initializeData();
    startAutoRefresh(); // 1 second

    return () => {
      cleanup();
    };
  });
</script>

<div class="min-h-screen bg-background p-4 md:p-6 lg:p-8">
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- Dashboard Header -->
    <DashboardHeader />

    <!-- Status Indicator -->
    <StatusIndicator />

    <!-- Stats Cards -->
    <StatsCards />

    <!-- Main Chart -->
    <SensorChart />
  </div>
</div>

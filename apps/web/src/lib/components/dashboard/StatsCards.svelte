<script lang="ts">
  import { Thermometer, Droplets, Activity } from '@lucide/svelte/icons';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as m from '$lib/paraglide/messages.js';
  import { sensorData } from '$lib/stores/data.svelte.js';

  function getTemperatureStatus(temp: number): {
    status: string;
    color: string;
  } {
    if (temp < 15)
      return {
        status: m['temperature.status.cold'](),
        color: 'text-blue-600',
      };
    if (temp > 25)
      return {
        status: m['temperature.status.hot'](),
        color: 'text-red-600',
      };
    return {
      status: m['temperature.status.normal'](),
      color: 'text-green-600',
    };
  }

  function getHumidityStatus(humidity: number): {
    status: string;
    color: string;
  } {
    if (humidity < 30)
      return {
        status: m['humidity.status.dry'](),
        color: 'text-orange-600',
      };
    if (humidity > 70)
      return {
        status: m['humidity.status.humid'](),
        color: 'text-blue-600',
      };
    return {
      status: m['humidity.status.normal'](),
      color: 'text-green-600',
    };
  }
</script>

<div class="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-2">
  <!-- Temperature Card -->
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
      <Card.Title class="font-medium">{m['temperature.title']()}</Card.Title>
      <Thermometer class="h-5 w-5 min-h-5 min-w-5 text-muted-foreground" />
    </Card.Header>
    <Card.Content class="mt-auto">
      {#if sensorData.isLoading.stats}
        <div class="text-2xl font-bold">...</div>
        <p class="text-xs text-muted-foreground">{m['dashboard.loading']()}</p>
      {:else if sensorData.errors.stats}
        <div class="text-2xl font-bold text-red-600">--</div>
        <p class="text-xs text-red-600">{sensorData.errors.stats}</p>
      {:else if sensorData.stats}
        <div class="text-xl md:text-2xl font-bold">
          {m['temperature.celsius']({
            value: sensorData.stats.avgTemperature.toFixed(1),
          })}
        </div>
        <p class="text-xs text-muted-foreground">
          {m['temperature.min']()}: {m['temperature.celsius']({
            value: sensorData.stats.minTemperature.toFixed(1),
          })}
          <br />
          {m['temperature.max']()}: {m['temperature.celsius']({
            value: sensorData.stats.maxTemperature.toFixed(1),
          })}
        </p>

        <div class="flex items-center gap-1 mt-2">
          {#if sensorData.stats}
            {@const tempStatus = getTemperatureStatus(
              sensorData.stats.avgTemperature
            )}
            <span class="text-xs {tempStatus.color}">{tempStatus.status}</span>
          {/if}
        </div>
      {:else}
        <div class="text-2xl font-bold">--</div>
        <p class="text-xs text-muted-foreground">{m['dashboard.noData']()}</p>
      {/if}
    </Card.Content>
  </Card.Root>

  <!-- Humidity Card -->
  <Card.Root>
    <Card.Header
      class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
      <Card.Title class="font-medium">{m['humidity.title']()}</Card.Title>
      <Droplets class="h-5 w-5 min-h-5 min-w-5 text-muted-foreground" />
    </Card.Header>
    <Card.Content class="mt-auto ">
      {#if sensorData.isLoading.stats}
        <div class="text-2xl font-bold">...</div>
        <p class="text-xs text-muted-foreground">{m['dashboard.loading']()}</p>
      {:else if sensorData.errors.stats}
        <div class="text-2xl font-bold text-red-600">--</div>
        <p class="text-xs text-red-600">{sensorData.errors.stats}</p>
      {:else if sensorData.stats}
        <div class="text-xl md:text-2xl font-bold">
          {m['humidity.percentage']({
            value: sensorData.stats.avgHumidity.toFixed(1),
          })}
        </div>
        <p class="text-xs text-muted-foreground">
          {m['humidity.min']()}: {m['humidity.percentage']({
            value: sensorData.stats.minHumidity.toFixed(1),
          })}
          <br />
          {m['humidity.max']()}: {m['humidity.percentage']({
            value: sensorData.stats.maxHumidity.toFixed(1),
          })}
        </p>
        <div class="flex items-center gap-1 mt-2">
          {#if sensorData.stats}
            {@const humidityStatus = getHumidityStatus(
              sensorData.stats.avgHumidity
            )}
            <span class="text-xs {humidityStatus.color}"
              >{humidityStatus.status}</span
            >
          {/if}
        </div>
      {:else}
        <div class="text-2xl font-bold">--</div>
        <p class="text-xs text-muted-foreground">{m['dashboard.noData']()}</p>
      {/if}
    </Card.Content>
  </Card.Root>
</div>

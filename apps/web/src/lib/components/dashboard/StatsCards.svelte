<script lang="ts">
  import { Thermometer, Droplets, TrendingUp, TrendingDown, Minus } from '@lucide/svelte/icons';
  import { sensorData } from '$lib/stores/data.svelte.js';

  function getTemperatureStatus(temp: number): {
    status: string;
    color: string;
    icon: typeof TrendingUp;
  } {
    if (temp < 15)
      return { status: 'Cold', color: 'oklch(0.72 0.12 230)', icon: TrendingDown };
    if (temp > 25)
      return { status: 'Hot', color: 'oklch(0.70 0.19 25)', icon: TrendingUp };
    return { status: 'Normal', color: 'oklch(0.75 0.18 150)', icon: Minus };
  }

  function getHumidityStatus(humidity: number): {
    status: string;
    color: string;
    icon: typeof TrendingUp;
  } {
    if (humidity < 30)
      return { status: 'Dry', color: 'oklch(0.78 0.14 60)', icon: TrendingDown };
    if (humidity > 70)
      return { status: 'Humid', color: 'oklch(0.65 0.16 260)', icon: TrendingUp };
    return { status: 'Normal', color: 'oklch(0.75 0.18 150)', icon: Minus };
  }
</script>

<div class="grid gap-2.5 md:gap-4 grid-cols-2">
  <!-- Temperature Card -->
  <div
    class="relative rounded-xl md:rounded-2xl glass-panel glow-temp overflow-hidden p-3 md:p-5 flex flex-col gap-2 md:gap-3"
    style="background: linear-gradient(135deg, var(--temp-surface), transparent);"
  >
    <div class="flex items-center gap-1.5 md:gap-2">
      <div
        class="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center"
        style="background: var(--temp-surface); border: 1px solid oklch(0.82 0.14 55 / 12%);"
      >
        <Thermometer
          class="w-3 h-3 md:w-4 md:h-4"
          style="color: var(--temp-color);"
        />
      </div>
      <span
        class="text-[10px] md:text-xs font-medium uppercase tracking-wider"
        style="color: var(--muted-foreground); letter-spacing: 0.08em;"
      >
        Temperature
      </span>
    </div>

    {#if sensorData.isLoading.stats}
      <div class="flex flex-col gap-1.5">
        <div class="h-8 md:h-12 w-20 md:w-28 rounded-lg shimmer"></div>
        <div class="h-3 w-16 md:w-20 rounded shimmer"></div>
      </div>
    {:else if sensorData.errors.stats}
      <div
        class="text-xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--destructive);"
      >--</div>
      <p class="text-[10px] md:text-xs" style="color: var(--destructive);">{sensorData.errors.stats}</p>
    {:else if sensorData.stats}
      <div class="flex items-baseline gap-0.5">
        <span
          class="text-2xl md:text-4xl lg:text-5xl font-bold reading-glow-temp tabular-nums"
          style="font-family: 'JetBrains Mono', monospace; color: var(--temp-color); letter-spacing: -0.03em;"
        >
          {sensorData.stats.avgTemperature.toFixed(1)}
        </span>
        <span
          class="text-sm md:text-xl font-light"
          style="color: oklch(0.82 0.14 55 / 50%);"
        >&deg;C</span>
      </div>

      <div class="flex items-center gap-1.5 flex-wrap">
        <span
          class="inline-flex rounded px-1.5 py-px text-[9px] md:text-[11px] font-medium tabular-nums"
          style="background: oklch(0.82 0.14 55 / 8%); color: oklch(0.82 0.14 55 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          Lo {sensorData.stats.minTemperature.toFixed(1)}&deg;
        </span>
        <span
          class="inline-flex rounded px-1.5 py-px text-[9px] md:text-[11px] font-medium tabular-nums"
          style="background: oklch(0.82 0.14 55 / 8%); color: oklch(0.82 0.14 55 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          Hi {sensorData.stats.maxTemperature.toFixed(1)}&deg;
        </span>
      </div>

      {@const tempStatus = getTemperatureStatus(sensorData.stats.avgTemperature)}
      <div class="flex items-center gap-1 mt-auto">
        <svelte:component
          this={tempStatus.icon}
          class="w-2.5 h-2.5 md:w-3 md:h-3"
          style="color: {tempStatus.color};"
        />
        <span
          class="text-[10px] md:text-xs font-medium"
          style="color: {tempStatus.color};"
        >{tempStatus.status}</span>
      </div>
    {:else}
      <div
        class="text-xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--muted-foreground);"
      >--</div>
      <p class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">No data</p>
    {/if}
  </div>

  <!-- Humidity Card -->
  <div
    class="relative rounded-xl md:rounded-2xl glass-panel glow-humid overflow-hidden p-3 md:p-5 flex flex-col gap-2 md:gap-3"
    style="background: linear-gradient(135deg, var(--humid-surface), transparent);"
  >
    <div class="flex items-center gap-1.5 md:gap-2">
      <div
        class="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center"
        style="background: var(--humid-surface); border: 1px solid oklch(0.72 0.12 190 / 12%);"
      >
        <Droplets
          class="w-3 h-3 md:w-4 md:h-4"
          style="color: var(--humid-color);"
        />
      </div>
      <span
        class="text-[10px] md:text-xs font-medium uppercase tracking-wider"
        style="color: var(--muted-foreground); letter-spacing: 0.08em;"
      >
        Humidity
      </span>
    </div>

    {#if sensorData.isLoading.stats}
      <div class="flex flex-col gap-1.5">
        <div class="h-8 md:h-12 w-20 md:w-28 rounded-lg shimmer"></div>
        <div class="h-3 w-16 md:w-20 rounded shimmer"></div>
      </div>
    {:else if sensorData.errors.stats}
      <div
        class="text-xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--destructive);"
      >--</div>
      <p class="text-[10px] md:text-xs" style="color: var(--destructive);">{sensorData.errors.stats}</p>
    {:else if sensorData.stats}
      <div class="flex items-baseline gap-0.5">
        <span
          class="text-2xl md:text-4xl lg:text-5xl font-bold reading-glow-humid tabular-nums"
          style="font-family: 'JetBrains Mono', monospace; color: var(--humid-color); letter-spacing: -0.03em;"
        >
          {sensorData.stats.avgHumidity.toFixed(1)}
        </span>
        <span
          class="text-sm md:text-xl font-light"
          style="color: oklch(0.72 0.12 190 / 50%);"
        >%</span>
      </div>

      <div class="flex items-center gap-1.5 flex-wrap">
        <span
          class="inline-flex rounded px-1.5 py-px text-[9px] md:text-[11px] font-medium tabular-nums"
          style="background: oklch(0.72 0.12 190 / 8%); color: oklch(0.72 0.12 190 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          Lo {sensorData.stats.minHumidity.toFixed(1)}%
        </span>
        <span
          class="inline-flex rounded px-1.5 py-px text-[9px] md:text-[11px] font-medium tabular-nums"
          style="background: oklch(0.72 0.12 190 / 8%); color: oklch(0.72 0.12 190 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          Hi {sensorData.stats.maxHumidity.toFixed(1)}%
        </span>
      </div>

      {@const humidityStatus = getHumidityStatus(sensorData.stats.avgHumidity)}
      <div class="flex items-center gap-1 mt-auto">
        <svelte:component
          this={humidityStatus.icon}
          class="w-2.5 h-2.5 md:w-3 md:h-3"
          style="color: {humidityStatus.color};"
        />
        <span
          class="text-[10px] md:text-xs font-medium"
          style="color: {humidityStatus.color};"
        >{humidityStatus.status}</span>
      </div>
    {:else}
      <div
        class="text-xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--muted-foreground);"
      >--</div>
      <p class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">No data</p>
    {/if}
  </div>
</div>

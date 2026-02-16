<script lang="ts">
  import { Thermometer, Droplets, TrendingUp, TrendingDown, Minus } from '@lucide/svelte/icons';
  import * as m from '$lib/paraglide/messages.js';
  import { sensorData } from '$lib/stores/data.svelte.js';

  function getTemperatureStatus(temp: number): {
    status: string;
    color: string;
    icon: typeof TrendingUp;
  } {
    if (temp < 15)
      return {
        status: m['temperature.status.cold'](),
        color: 'oklch(0.72 0.12 230)',
        icon: TrendingDown,
      };
    if (temp > 25)
      return {
        status: m['temperature.status.hot'](),
        color: 'oklch(0.70 0.19 25)',
        icon: TrendingUp,
      };
    return {
      status: m['temperature.status.normal'](),
      color: 'oklch(0.75 0.18 150)',
      icon: Minus,
    };
  }

  function getHumidityStatus(humidity: number): {
    status: string;
    color: string;
    icon: typeof TrendingUp;
  } {
    if (humidity < 30)
      return {
        status: m['humidity.status.dry'](),
        color: 'oklch(0.78 0.14 60)',
        icon: TrendingDown,
      };
    if (humidity > 70)
      return {
        status: m['humidity.status.humid'](),
        color: 'oklch(0.65 0.16 260)',
        icon: TrendingUp,
      };
    return {
      status: m['humidity.status.normal'](),
      color: 'oklch(0.75 0.18 150)',
      icon: Minus,
    };
  }
</script>

<div class="grid gap-3 md:gap-4 grid-cols-2">
  <!-- ═══ Temperature Card ═══ -->
  <div
    class="relative rounded-2xl glass-panel glow-temp overflow-hidden p-4 md:p-5 flex flex-col gap-3"
    style="background: linear-gradient(135deg, var(--temp-surface), transparent);"
  >
    <!-- Top row: icon + label -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
          style="background: var(--temp-surface); border: 1px solid oklch(0.82 0.14 55 / 12%);"
        >
          <Thermometer
            class="w-3.5 h-3.5 md:w-4 md:h-4"
            style="color: var(--temp-color);"
          />
        </div>
        <span
          class="text-xs md:text-sm font-medium uppercase tracking-wider"
          style="color: var(--muted-foreground); letter-spacing: 0.08em;"
        >
          {m['temperature.title']()}
        </span>
      </div>
    </div>

    <!-- Hero number -->
    {#if sensorData.isLoading.stats}
      <div class="flex flex-col gap-2">
        <div class="h-10 md:h-12 w-28 rounded-lg shimmer"></div>
        <div class="h-3 w-20 rounded shimmer"></div>
      </div>
    {:else if sensorData.errors.stats}
      <div
        class="text-2xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--destructive);"
      >--</div>
      <p class="text-xs" style="color: var(--destructive);">{sensorData.errors.stats}</p>
    {:else if sensorData.stats}
      <div class="flex items-baseline gap-1">
        <span
          class="text-3xl md:text-4xl lg:text-5xl font-bold reading-glow-temp tabular-nums"
          style="font-family: 'JetBrains Mono', monospace; color: var(--temp-color); letter-spacing: -0.03em;"
        >
          {sensorData.stats.avgTemperature.toFixed(1)}
        </span>
        <span
          class="text-lg md:text-xl font-light"
          style="color: oklch(0.82 0.14 55 / 50%);"
        >
          &deg;C
        </span>
      </div>

      <!-- Min / Max pills -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] md:text-xs font-medium tabular-nums"
          style="background: oklch(0.82 0.14 55 / 8%); color: oklch(0.82 0.14 55 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          {m['temperature.min']()}&nbsp;{sensorData.stats.minTemperature.toFixed(1)}&deg;
        </span>
        <span
          class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] md:text-xs font-medium tabular-nums"
          style="background: oklch(0.82 0.14 55 / 8%); color: oklch(0.82 0.14 55 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          {m['temperature.max']()}&nbsp;{sensorData.stats.maxTemperature.toFixed(1)}&deg;
        </span>
      </div>

      <!-- Status badge -->
      {@const tempStatus = getTemperatureStatus(sensorData.stats.avgTemperature)}
      <div class="flex items-center gap-1.5 mt-auto">
        <svelte:component
          this={tempStatus.icon}
          class="w-3 h-3"
          style="color: {tempStatus.color};"
        />
        <span
          class="text-[11px] md:text-xs font-medium"
          style="color: {tempStatus.color};"
        >
          {tempStatus.status}
        </span>
      </div>
    {:else}
      <div
        class="text-2xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--muted-foreground);"
      >--</div>
      <p class="text-xs" style="color: var(--muted-foreground);">{m['dashboard.noData']()}</p>
    {/if}
  </div>

  <!-- ═══ Humidity Card ═══ -->
  <div
    class="relative rounded-2xl glass-panel glow-humid overflow-hidden p-4 md:p-5 flex flex-col gap-3"
    style="background: linear-gradient(135deg, var(--humid-surface), transparent);"
  >
    <!-- Top row: icon + label -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
          style="background: var(--humid-surface); border: 1px solid oklch(0.72 0.12 190 / 12%);"
        >
          <Droplets
            class="w-3.5 h-3.5 md:w-4 md:h-4"
            style="color: var(--humid-color);"
          />
        </div>
        <span
          class="text-xs md:text-sm font-medium uppercase tracking-wider"
          style="color: var(--muted-foreground); letter-spacing: 0.08em;"
        >
          {m['humidity.title']()}
        </span>
      </div>
    </div>

    <!-- Hero number -->
    {#if sensorData.isLoading.stats}
      <div class="flex flex-col gap-2">
        <div class="h-10 md:h-12 w-28 rounded-lg shimmer"></div>
        <div class="h-3 w-20 rounded shimmer"></div>
      </div>
    {:else if sensorData.errors.stats}
      <div
        class="text-2xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--destructive);"
      >--</div>
      <p class="text-xs" style="color: var(--destructive);">{sensorData.errors.stats}</p>
    {:else if sensorData.stats}
      <div class="flex items-baseline gap-1">
        <span
          class="text-3xl md:text-4xl lg:text-5xl font-bold reading-glow-humid tabular-nums"
          style="font-family: 'JetBrains Mono', monospace; color: var(--humid-color); letter-spacing: -0.03em;"
        >
          {sensorData.stats.avgHumidity.toFixed(1)}
        </span>
        <span
          class="text-lg md:text-xl font-light"
          style="color: oklch(0.72 0.12 190 / 50%);"
        >
          %
        </span>
      </div>

      <!-- Min / Max pills -->
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] md:text-xs font-medium tabular-nums"
          style="background: oklch(0.72 0.12 190 / 8%); color: oklch(0.72 0.12 190 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          {m['humidity.min']()}&nbsp;{sensorData.stats.minHumidity.toFixed(1)}%
        </span>
        <span
          class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] md:text-xs font-medium tabular-nums"
          style="background: oklch(0.72 0.12 190 / 8%); color: oklch(0.72 0.12 190 / 70%); font-family: 'JetBrains Mono', monospace;"
        >
          {m['humidity.max']()}&nbsp;{sensorData.stats.maxHumidity.toFixed(1)}%
        </span>
      </div>

      <!-- Status badge -->
      {@const humidityStatus = getHumidityStatus(sensorData.stats.avgHumidity)}
      <div class="flex items-center gap-1.5 mt-auto">
        <svelte:component
          this={humidityStatus.icon}
          class="w-3 h-3"
          style="color: {humidityStatus.color};"
        />
        <span
          class="text-[11px] md:text-xs font-medium"
          style="color: {humidityStatus.color};"
        >
          {humidityStatus.status}
        </span>
      </div>
    {:else}
      <div
        class="text-2xl md:text-3xl font-semibold"
        style="font-family: 'JetBrains Mono', monospace; color: var(--muted-foreground);"
      >--</div>
      <p class="text-xs" style="color: var(--muted-foreground);">{m['dashboard.noData']()}</p>
    {/if}
  </div>
</div>

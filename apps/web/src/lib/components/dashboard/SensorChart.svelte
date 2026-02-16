<script lang="ts">
  import { AreaChart, Area, ChartClipPath } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import { scaleUtc } from 'd3-scale';
  import { cubicInOut } from 'svelte/easing';
  import * as Chart from '$lib/components/ui/chart/index.js';
  import { sensorData, timeRange, setTimeRange } from '$lib/stores/data.svelte.js';

  const chartConfig = {
    temperature: {
      label: 'Temperature',
      color: 'var(--chart-1)',
    },
    humidity: {
      label: 'Humidity',
      color: 'var(--chart-2)',
    },
  } satisfies Chart.ChartConfig;

  const ranges = [
    { hours: 3, label: '3h' },
    { hours: 6, label: '6h' },
    { hours: 12, label: '12h' },
    { hours: 24, label: '24h' },
  ];

  function formatTime(date: Date): string {
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour} ${ampm}`;
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="flex flex-col h-full min-h-0 rounded-xl md:rounded-2xl glass-panel chart-glow overflow-hidden">
  <!-- Chart header -->
  <div class="flex items-center justify-between px-3 md:px-5 pt-3 md:pt-4 pb-1.5 md:pb-2 gap-2">
    <div class="min-w-0">
      <h2
        class="text-xs md:text-sm font-semibold"
        style="letter-spacing: -0.01em;"
      >
        Sensor Data
      </h2>
      <p class="text-[10px] md:text-xs mt-0.5 hidden sm:block" style="color: var(--muted-foreground);">
        Temperature and humidity over the last {timeRange.hours} hours
      </p>
    </div>

    <div class="flex items-center gap-2 md:gap-3 shrink-0">
      <!-- Time range toggle -->
      <div
        class="flex items-center rounded-lg p-0.5"
        style="background: var(--glass); border: 1px solid var(--glass-border);"
      >
        {#each ranges as range}
          <button
            class="relative px-2 md:px-2.5 py-1 md:py-1.5 rounded-md text-[10px] md:text-[11px] font-medium transition-all duration-200 tabular-nums"
            style="
              font-family: 'JetBrains Mono', monospace;
              {timeRange.hours === range.hours
                ? 'background: var(--glass-border); color: var(--foreground);'
                : 'color: var(--muted-foreground);'}
            "
            onclick={() => setTimeRange(range.hours)}
          >
            {range.label}
          </button>
        {/each}
      </div>

      <!-- Legend dots (hidden on small screens) -->
      <div class="hidden md:flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <span
            class="w-1.5 h-1.5 rounded-full"
            style="background: var(--temp-color); box-shadow: 0 0 6px var(--temp-glow);"
          ></span>
          <span class="text-[10px]" style="color: var(--muted-foreground);">Temp</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="w-1.5 h-1.5 rounded-full"
            style="background: var(--humid-color); box-shadow: 0 0 6px var(--humid-glow);"
          ></span>
          <span class="text-[10px]" style="color: var(--muted-foreground);">Humid</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Chart body -->
  <div class="flex-1 min-h-0 px-1 md:px-3 pb-2 md:pb-3">
    {#if sensorData.isLoading.chart}
      <div class="flex items-center justify-center h-full">
        <div class="text-center space-y-2">
          <div class="flex justify-center gap-1">
            {#each Array(3) as _, i}
              <div
                class="w-1 h-6 md:w-1.5 md:h-8 rounded-full shimmer"
                style="animation-delay: {i * 150}ms; background: var(--glass-border);"
              ></div>
            {/each}
          </div>
          <p class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">
            Loading...
          </p>
        </div>
      </div>
    {:else if sensorData.errors.chart}
      <div class="flex items-center justify-center h-full">
        <div class="text-center space-y-1">
          <p class="text-xs md:text-sm font-medium" style="color: var(--destructive);">
            {sensorData.errors.chart}
          </p>
          <p class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">
            Failed to load chart data
          </p>
        </div>
      </div>
    {:else if sensorData.chartData.length === 0}
      <div class="flex items-center justify-center h-full">
        <div class="text-center space-y-1">
          <p class="text-xs md:text-sm font-medium" style="color: var(--muted-foreground);">
            No chart data
          </p>
          <p class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">
            No sensor data available
          </p>
        </div>
      </div>
    {:else}
      <Chart.Container
        config={chartConfig}
        class="h-full w-full"
      >
        <AreaChart
          data={sensorData.chartData}
          x="time"
          xScale={scaleUtc()}
          yPadding={[0, 25]}
          yDomain={(() => {
            const allValues = sensorData.chartData.flatMap((d) => [
              d.temperature,
              d.humidity,
            ]);
            const minValue = Math.min(...allValues);
            const maxValue = Math.max(...allValues);
            return [minValue - 5, maxValue + 5];
          })()}
          series={[
            {
              key: 'temperature',
              label: 'Temperature',
              color: chartConfig.temperature.color,
            },
            {
              key: 'humidity',
              label: 'Humidity',
              color: chartConfig.humidity.color,
            },
          ]}
          props={{
            area: {
              curve: curveNatural,
              'fill-opacity': 0.3,
              line: { class: 'stroke-[1.5]' },
              motion: 'tween',
            },
            xAxis: {
              ticks: 5,
              format: formatTime,
            },
            yAxis: {
              format: (v: number) => `${v.toFixed(0)}`,
            },
          }}
        >
          {#snippet marks({ series, getAreaProps })}
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-temperature)" stop-opacity={0.5} />
                <stop offset="70%" stop-color="var(--color-temperature)" stop-opacity={0.08} />
                <stop offset="100%" stop-color="var(--color-temperature)" stop-opacity={0} />
              </linearGradient>
              <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--color-humidity)" stop-opacity={0.5} />
                <stop offset="70%" stop-color="var(--color-humidity)" stop-opacity={0.08} />
                <stop offset="100%" stop-color="var(--color-humidity)" stop-opacity={0} />
              </linearGradient>
            </defs>
            <ChartClipPath
              initialWidth={0}
              motion={{
                width: { type: 'tween', duration: 1200, easing: cubicInOut },
              }}
            >
              {#each series as s, i (s.key)}
                <Area
                  {...getAreaProps(s, i)}
                  fill={s.key === 'temperature'
                    ? 'url(#fillTemperature)'
                    : 'url(#fillHumidity)'}
                />
              {/each}
            </ChartClipPath>
          {/snippet}
          {#snippet tooltip()}
            <Chart.Tooltip labelFormatter={formatDate} indicator="line" />
          {/snippet}
        </AreaChart>
      </Chart.Container>
    {/if}
  </div>

  <!-- Mobile legend + footer -->
  <div
    class="flex items-center justify-between px-3 md:px-5 py-2 md:py-2.5"
    style="border-top: 1px solid var(--glass-border);"
  >
    <!-- Mobile legend (visible only on small screens) -->
    <div class="flex md:hidden items-center gap-3">
      <div class="flex items-center gap-1">
        <span
          class="w-1.5 h-1.5 rounded-full"
          style="background: var(--temp-color); box-shadow: 0 0 6px var(--temp-glow);"
        ></span>
        <span class="text-[10px]" style="color: var(--muted-foreground);">Temp</span>
      </div>
      <div class="flex items-center gap-1">
        <span
          class="w-1.5 h-1.5 rounded-full"
          style="background: var(--humid-color); box-shadow: 0 0 6px var(--humid-glow);"
        ></span>
        <span class="text-[10px]" style="color: var(--muted-foreground);">Humid</span>
      </div>
    </div>

    <span
      class="text-[10px] md:text-[11px] tabular-nums ml-auto"
      style="color: var(--muted-foreground); opacity: 0.7; font-family: 'JetBrains Mono', monospace;"
    >
      {sensorData.chartData.length} readings
    </span>
  </div>
</div>

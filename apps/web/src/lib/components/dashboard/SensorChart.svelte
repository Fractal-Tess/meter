<script lang="ts">
  import { AreaChart, Area, ChartClipPath } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import { scaleUtc } from 'd3-scale';
  import { cubicInOut } from 'svelte/easing';
  import * as Chart from '$lib/components/ui/chart/index.js';
  import * as m from '$lib/paraglide/messages.js';
  import { sensorData } from '$lib/stores/data.svelte.js';
  import { getLocale } from '$lib/paraglide/runtime.js';

  const chartConfig = {
    temperature: {
      label: m['temperature.title'](),
      color: 'var(--chart-1)',
    },
    humidity: {
      label: m['humidity.title'](),
      color: 'var(--chart-2)',
    },
  } satisfies Chart.ChartConfig;

  function formatTime(date: Date): string {
    const hours = date.getHours();
    const ampm = hours >= 12 ? m['time.pm']() : m['time.am']();
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour.toString().padStart(2, '0')} ${ampm}`;
  }

  function formatDate(date: Date): string {
    const locale = getLocale();
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return date.toLocaleDateString(
      locale === 'bg' ? 'bg-BG' : 'en-US',
      options
    );
  }
</script>

<div class="flex flex-col h-full min-h-0 rounded-2xl glass-panel chart-glow overflow-hidden">
  <!-- Chart header -->
  <div class="flex items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-2">
    <div>
      <h2
        class="text-sm md:text-base font-semibold"
        style="letter-spacing: -0.01em;"
      >
        {m['combined.title']()}
      </h2>
      <p class="text-[11px] md:text-xs mt-0.5" style="color: var(--muted-foreground);">
        {m['combined.description']()}
      </p>
    </div>

    <!-- Legend dots -->
    <div class="flex items-center gap-3 md:gap-4">
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          style="background: var(--temp-color); box-shadow: 0 0 6px var(--temp-glow);"
        ></span>
        <span class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">
          {m['temperature.title']()}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          style="background: var(--humid-color); box-shadow: 0 0 6px var(--humid-glow);"
        ></span>
        <span class="text-[10px] md:text-xs" style="color: var(--muted-foreground);">
          {m['humidity.title']()}
        </span>
      </div>
    </div>
  </div>

  <!-- Chart body -->
  <div class="flex-1 min-h-0 px-2 md:px-3 pb-3">
    {#if sensorData.isLoading.chart}
      <div class="flex items-center justify-center h-full">
        <div class="text-center space-y-2">
          <div class="flex justify-center gap-1">
            {#each Array(3) as _, i}
              <div
                class="w-1.5 h-8 rounded-full shimmer"
                style="animation-delay: {i * 150}ms; background: var(--glass-border);"
              ></div>
            {/each}
          </div>
          <p class="text-xs" style="color: var(--muted-foreground);">
            {m['dashboard.loading']()}
          </p>
        </div>
      </div>
    {:else if sensorData.errors.chart}
      <div class="flex items-center justify-center h-full">
        <div class="text-center space-y-1">
          <p class="text-sm font-medium" style="color: var(--destructive);">
            {sensorData.errors.chart}
          </p>
          <p class="text-xs" style="color: var(--muted-foreground);">
            {m['dashboard.failedToLoadChartData']()}
          </p>
        </div>
      </div>
    {:else if sensorData.chartData.length === 0}
      <div class="flex items-center justify-center h-full">
        <div class="text-center space-y-1">
          <p class="text-sm font-medium" style="color: var(--muted-foreground);">
            {m['dashboard.noChartData']()}
          </p>
          <p class="text-xs" style="color: var(--muted-foreground);">
            {m['dashboard.noSensorDataAvailable']()}
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
              label: m['temperature.title'](),
              color: chartConfig.temperature.color,
            },
            {
              key: 'humidity',
              label: m['humidity.title'](),
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
              ticks: 6,
              format: formatTime,
            },
            yAxis: {
              format: (v: number) => `${v.toFixed(0)}`,
            },
          }}
        >
          {#snippet marks({ series, getAreaProps })}
            <defs>
              <!-- Temperature gradient: amber -->
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stop-color="var(--color-temperature)"
                  stop-opacity={0.5}
                />
                <stop
                  offset="70%"
                  stop-color="var(--color-temperature)"
                  stop-opacity={0.08}
                />
                <stop
                  offset="100%"
                  stop-color="var(--color-temperature)"
                  stop-opacity={0}
                />
              </linearGradient>
              <!-- Humidity gradient: teal -->
              <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stop-color="var(--color-humidity)"
                  stop-opacity={0.5}
                />
                <stop
                  offset="70%"
                  stop-color="var(--color-humidity)"
                  stop-opacity={0.08}
                />
                <stop
                  offset="100%"
                  stop-color="var(--color-humidity)"
                  stop-opacity={0}
                />
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

  <!-- Chart footer -->
  <div
    class="flex items-center justify-between px-4 md:px-5 py-2.5 md:py-3"
    style="border-top: 1px solid var(--glass-border);"
  >
    <span class="text-[11px] md:text-xs font-medium" style="color: var(--muted-foreground);">
      {m['combined.footer']()}
    </span>
    <span class="text-[10px] md:text-[11px]" style="color: var(--muted-foreground); opacity: 0.7;">
      {m['combined.footerSubtitle']()}
    </span>
  </div>
</div>

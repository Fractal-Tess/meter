<script lang="ts">
  import { AreaChart, Area, ChartClipPath } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import { scaleUtc } from 'd3-scale';
  import { cubicInOut } from 'svelte/easing';
  import * as Chart from '$lib/components/ui/chart/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
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

  // Helper function to format time with locale-aware AM/PM
  function formatTime(date: Date): string {
    const hours = date.getHours();
    const ampm = hours >= 12 ? m['time.pm']() : m['time.am']();
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour.toString().padStart(2, '0')} ${ampm}`;
  }

  // Helper function to format date with locale-aware formatting
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

<Card.Root class="flex flex-col flex-1 min-h-0">
  <Card.Header>
    <Card.Title>{m['combined.title']()}</Card.Title>
    <Card.Description>
      {m['combined.description']()}
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex-1 flex flex-col min-h-0">
    {#if sensorData.isLoading.chart}
      <div class="flex items-center justify-center h-64 md:h-80">
        <div class="text-center">
          <div class="text-lg font-medium">{m['dashboard.loading']()}</div>
          <div class="text-sm text-muted-foreground">
            {m['dashboard.loadingSensorData']()}
          </div>
        </div>
      </div>
    {:else if sensorData.errors.chart}
      <div class="flex items-center justify-center h-64 md:h-80">
        <div class="text-center">
          <div class="text-lg font-medium text-red-600">
            {sensorData.errors.chart}
          </div>
          <div class="text-sm text-muted-foreground">
            {m['dashboard.failedToLoadChartData']()}
          </div>
        </div>
      </div>
    {:else if sensorData.chartData.length === 0}
      <div class="flex items-center justify-center h-64 md:h-80">
        <div class="text-center">
          <div class="text-lg font-medium">{m['dashboard.noChartData']()}</div>
          <div class="text-sm text-muted-foreground">
            {m['dashboard.noSensorDataAvailable']()}
          </div>
        </div>
      </div>
    {:else}
      <Chart.Container
        config={chartConfig}
        class="h-full min-h-[300px] md:min-h-[400px] w-full"
      >
        <AreaChart
          legend
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
              'fill-opacity': 0.4,
              line: { class: 'stroke-1' },
              motion: 'tween',
            },
            xAxis: {
              ticks: 6,
              format: formatTime,
            },
            yAxis: {
              format: (v: number) => `${v.toFixed(1)}`,
            },
          }}
        >
          {#snippet marks({ series, getAreaProps })}
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stop-color="var(--color-temperature)"
                  stop-opacity={1}
                />
                <stop
                  offset="95%"
                  stop-color="var(--color-temperature)"
                  stop-opacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stop-color="var(--color-humidity)"
                  stop-opacity={1}
                />
                <stop
                  offset="95%"
                  stop-color="var(--color-humidity)"
                  stop-opacity={0.1}
                />
              </linearGradient>
            </defs>
            <ChartClipPath
              initialWidth={0}
              motion={{
                width: { type: 'tween', duration: 1000, easing: cubicInOut },
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
  </Card.Content>
  <Card.Footer>
    <div class="flex w-full items-start gap-2 text-sm">
      <div class="grid gap-2">
        <div class="flex items-center gap-2 font-medium leading-none">
          {m['combined.footer']()}
        </div>
        <div class="text-muted-foreground flex items-center gap-2 leading-none">
          {m['combined.footerSubtitle']()}
        </div>
      </div>
    </div>
  </Card.Footer>
</Card.Root>

<script lang="ts">
  import { AreaChart } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import { scaleUtc } from 'd3-scale';
  import * as Chart from '$lib/components/ui/chart/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as m from '$lib/paraglide/messages.js';
  import { sensorData } from '$lib/stores/data.svelte.js';

  const chartConfig = {
    temperature: { label: m['temperature.title'](), color: 'var(--chart-1)' },
    humidity: { label: m['humidity.title'](), color: 'var(--chart-2)' },
  } satisfies Chart.ChartConfig;

  function getTimeRangeLabel(timeRange: string): string {
    switch (timeRange) {
      case '1h':
        return 'Last Hour';
      case '6h':
        return 'Last 6 Hours';
      case '24h':
        return 'Last 24 Hours';
      case '7d':
        return 'Last 7 Days';
      default:
        return 'Last 24 Hours';
    }
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{m['combined.title']()}</Card.Title>
    <Card.Description>
      {m['combined.description']()} - {getTimeRangeLabel(sensorData.timeRange)}
    </Card.Description>
  </Card.Header>
  <Card.Content>
    {#if sensorData.isLoading.chart}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="text-lg font-medium">{m['dashboard.loading']()}</div>
          <div class="text-sm text-muted-foreground">
            Loading sensor data...
          </div>
        </div>
      </div>
    {:else if sensorData.errors.chart}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="text-lg font-medium text-red-600">
            {sensorData.errors.chart}
          </div>
          <div class="text-sm text-muted-foreground">
            Failed to load chart data
          </div>
        </div>
      </div>
    {:else if sensorData.chartData.length === 0}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="text-lg font-medium">{m['dashboard.noChartData']()}</div>
          <div class="text-sm text-muted-foreground">
            No sensor data available
          </div>
        </div>
      </div>
    {:else}
      <Chart.Container config={chartConfig}>
        <AreaChart
          legend
          data={sensorData.chartData}
          x="time"
          xScale={scaleUtc()}
          yPadding={[0, 100]}
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
              format: (v: Date) =>
                v.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                }),
            },
            yAxis: {
              format: (v: number) => `${v.toFixed(1)}`,
            },
          }}
        >
          {#snippet tooltip()}
            <Chart.Tooltip
              labelFormatter={(v: Date) => {
                return v.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
              }}
              indicator="line"
            />
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
          {m['combined.footerSubtitle']()} - {getTimeRangeLabel(
            sensorData.timeRange
          )}
        </div>
      </div>
    </div>
  </Card.Footer>
</Card.Root>

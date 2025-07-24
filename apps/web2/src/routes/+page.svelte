<script lang="ts">
	import { influxDBService, type SensorReading, type ChartDataPoint } from '$lib/services/influxdb-client';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { scaleUtc } from "d3-scale";
	import { curveNatural } from "d3-shape";
	import { Area, AreaChart, LinearGradient } from "layerchart";
	import { Thermometer, Droplets, Clock, Activity, TrendingUp } from '@lucide/svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let latestReading = $state<SensorReading | null>(null);
	let chartData = $state<ChartDataPoint[]>([]);
	let stats = $state<any>(null);
	let loading = $state(true);
	let error = $state('');

	const chartConfig = {
		temperature: {
			label: "Temperature",
			color: "hsl(var(--chart-1))",
		},
		humidity: {
			label: "Humidity", 
			color: "hsl(var(--chart-2))",
		}
	} satisfies Chart.ChartConfig;

	$effect(async () => {
		await loadData();
		
		// Refresh data every 30 seconds
		const interval = setInterval(loadData, 30000);
		
		return () => clearInterval(interval);
	});

	async function loadData() {
		try {
			loading = true;
			error = '';
			
			// Load data in parallel
			const [reading, data, statsData] = await Promise.all([
				influxDBService.getLatestReading(),
				influxDBService.getChartData(24),
				influxDBService.getStats()
			]);
			
			latestReading = reading;
			chartData = data;
			stats = statsData;
		} catch (err) {
			error = m.dashboard_error();
			console.error('Error loading data:', err);
		} finally {
			loading = false;
		}
	}

	function formatTime(timestamp: string): string {
		return new Date(timestamp).toLocaleTimeString();
	}

	function formatDate(timestamp: string): string {
		return new Date(timestamp).toLocaleDateString();
	}

	function getTemperatureStatus(temp: number): { status: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
		if (temp < 15) return { status: m.temperature_status_cold(), variant: 'secondary' };
		if (temp > 30) return { status: m.temperature_status_hot(), variant: 'destructive' };
		return { status: m.temperature_status_normal(), variant: 'default' };
	}

	function getHumidityStatus(humidity: number): { status: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
		if (humidity < 30) return { status: m.humidity_status_dry(), variant: 'secondary' };
		if (humidity > 70) return { status: m.humidity_status_humid(), variant: 'destructive' };
		return { status: m.humidity_status_normal(), variant: 'default' };
	}

	// Computed values using runes
	const temperatureData = $derived(
		chartData.map(d => ({
			date: d.time,
			temperature: d.temperature
		}))
	);

	const humidityData = $derived(
		chartData.map(d => ({
			date: d.time,
			humidity: d.humidity
		}))
	);

	const combinedData = $derived(
		chartData.map(d => ({
			date: d.time,
			temperature: d.temperature,
			humidity: d.humidity
		}))
	);
</script>

<svelte:head>
	<title>{m.dashboard_title()}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
	<div class="max-w-7xl mx-auto space-y-6">
		<!-- Header -->
		<div class="flex justify-between items-start mb-6">
			<div class="text-center flex-1 space-y-2">
				<h1 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
					{m.dashboard_title()}
				</h1>
				<p class="text-slate-600 dark:text-slate-400">
					{m.dashboard_subtitle()}
				</p>
			</div>
			<div class="ml-4">
				<LanguageSwitcher />
			</div>
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
				{error}
			</div>
		{/if}

		{#if loading && !latestReading}
			<div class="flex items-center justify-center h-64 space-x-3">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span class="text-slate-600 dark:text-slate-400">{m.dashboard_loading()}</span>
			</div>
		{:else}
			<!-- Current Readings -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<!-- Temperature Card -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<Thermometer class="h-5 w-5 text-red-500" />
								<Card.Title class="text-base">{m.temperature_title()}</Card.Title>
							</div>
							{#if latestReading}
								<Badge variant={getTemperatureStatus(latestReading.temperature_celsius).variant}>
									{getTemperatureStatus(latestReading.temperature_celsius).status}
								</Badge>
							{/if}
						</div>
					</Card.Header>
					<Card.Content>
						{#if latestReading}
							<div class="space-y-2">
								<div class="text-3xl font-bold text-slate-900 dark:text-slate-100">
									{m.temperature_celsius({ value: latestReading.temperature_celsius.toFixed(1) })}
								</div>
								<div class="text-lg text-slate-600 dark:text-slate-400">
									{m.temperature_fahrenheit({ value: latestReading.temperature_fahrenheit.toFixed(1) })}
								</div>
								<div class="text-sm text-slate-500 dark:text-slate-500">
									<Clock class="inline h-4 w-4 mr-1" />
									{formatTime(latestReading.timestamp)}
								</div>
							</div>
						{:else}
							<div class="text-slate-500 dark:text-slate-400">{m.dashboard_nodata1()}</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Humidity Card -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<Droplets class="h-5 w-5 text-blue-500" />
								<Card.Title class="text-base">{m.humidity_title()}</Card.Title>
							</div>
							{#if latestReading}
								<Badge variant={getHumidityStatus(latestReading.humidity_percent).variant}>
									{getHumidityStatus(latestReading.humidity_percent).status}
								</Badge>
							{/if}
						</div>
					</Card.Header>
					<Card.Content>
						{#if latestReading}
							<div class="space-y-2">
								<div class="text-3xl font-bold text-slate-900 dark:text-slate-100">
									{m.humidity_percentage({ value: latestReading.humidity_percent.toFixed(1) })}
								</div>
								<div class="text-sm text-slate-500 dark:text-slate-500">
									<Clock class="inline h-4 w-4 mr-1" />
									{formatTime(latestReading.timestamp)}
								</div>
							</div>
						{:else}
							<div class="text-slate-500 dark:text-slate-400">{m.dashboard_nodata1()}</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Location Card -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center space-x-2">
							<Activity class="h-5 w-5 text-green-500" />
							<Card.Title class="text-base">{m.location_title()}</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						{#if latestReading}
							<div class="space-y-2">
								<div class="text-xl font-semibold text-slate-900 dark:text-slate-100 capitalize">
									{latestReading.location.replace('-', ' ')}
								</div>
								<div class="text-sm text-slate-500 dark:text-slate-500">
									{m.location_sensor()}
								</div>
							</div>
						{:else}
							<div class="text-slate-500 dark:text-slate-400">{m.dashboard_nodata1()}</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Last Update Card -->
				<Card.Root>
					<Card.Header>
						<div class="flex items-center space-x-2">
							<Clock class="h-5 w-5 text-purple-500" />
							<Card.Title class="text-base">{m.lastupdate_title1()}</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						{#if latestReading}
							<div class="space-y-2">
								<div class="text-lg font-semibold text-slate-900 dark:text-slate-100">
									{formatTime(latestReading.timestamp)}
								</div>
								<div class="text-sm text-slate-500 dark:text-slate-500">
									{formatDate(latestReading.timestamp)}
								</div>
							</div>
						{:else}
							<div class="text-slate-500 dark:text-slate-400">{m.dashboard_nodata1()}</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Temperature Chart -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center space-x-2">
						<Thermometer class="h-5 w-5 text-red-500" />
						<span>{m.temperature_chart_title()}</span>
					</Card.Title>
					<Card.Description>{m.temperature_chart_description()}</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if temperatureData.length > 0}
						<Chart.Container config={chartConfig}>
							<AreaChart
								data={temperatureData}
								x="date"
								xScale={scaleUtc()}
								yPadding={[0, 25]}
								series={[
									{
										key: "temperature",
										label: "Temperature (°C)",
										color: "var(--color-temperature)",
									}
								]}
								props={{
									area: {
										curve: curveNatural,
										"fill-opacity": 0.6,
										line: { class: "stroke-2" },
										motion: "tween",
									},
									xAxis: {
										format: (v: Date) => v.toLocaleDateString("en-US", { 
											hour: '2-digit', 
											minute: '2-digit' 
										}),
									},
									yAxis: { 
										format: (v: number) => `${v.toFixed(1)}°C`
									},
								}}
							>
								{#snippet tooltip()}
									<Chart.Tooltip
										indicator="dot"
										labelFormatter={(v: Date) => {
											return v.toLocaleDateString("en-US", {
												month: "long",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											});
										}}
									/>
								{/snippet}
								{#snippet marks({ series, getAreaProps })}
									{#each series as s, i (s.key)}
										<LinearGradient
											stops={[
												"hsl(var(--chart-1))",
												"color-mix(in lch, hsl(var(--chart-1)) 10%, transparent)",
											]}
											vertical
										>
											{#snippet children({ gradient })}
												<Area {...getAreaProps(s, i)} fill={gradient} />
											{/snippet}
										</LinearGradient>
									{/each}
								{/snippet}
							</AreaChart>
						</Chart.Container>
					{:else}
						<div class="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
							{m.dashboard_nochartdata2()}
						</div>
					{/if}
				</Card.Content>
				<Card.Footer>
					<div class="flex w-full items-start gap-2 text-sm">
						<div class="grid gap-2">
							<div class="flex items-center gap-2 font-medium leading-none">
								{m.temperature_chart_footer()} <TrendingUp class="size-4" />
							</div>
							<div class="text-muted-foreground flex items-center gap-2 leading-none">
								{m.temperature_chart_footersubtitle1()}
							</div>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>

			<!-- Humidity Chart -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center space-x-2">
						<Droplets class="h-5 w-5 text-blue-500" />
						<span>{m.humidity_chart_title()}</span>
					</Card.Title>
					<Card.Description>{m.humidity_chart_description()}</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if humidityData.length > 0}
						<Chart.Container config={chartConfig}>
							<AreaChart
								data={humidityData}
								x="date"
								xScale={scaleUtc()}
								yPadding={[0, 25]}
								series={[
									{
										key: "humidity",
										label: "Humidity (%)",
										color: "var(--color-humidity)",
									}
								]}
								props={{
									area: {
										curve: curveNatural,
										"fill-opacity": 0.6,
										line: { class: "stroke-2" },
										motion: "tween",
									},
									xAxis: {
										format: (v: Date) => v.toLocaleDateString("en-US", { 
											hour: '2-digit', 
											minute: '2-digit' 
										}),
									},
									yAxis: { 
										format: (v: number) => `${v.toFixed(1)}%`
									},
								}}
							>
								{#snippet tooltip()}
									<Chart.Tooltip
										indicator="dot"
										labelFormatter={(v: Date) => {
											return v.toLocaleDateString("en-US", {
												month: "long",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											});
										}}
									/>
								{/snippet}
								{#snippet marks({ series, getAreaProps })}
									{#each series as s, i (s.key)}
										<LinearGradient
											stops={[
												"hsl(var(--chart-2))",
												"color-mix(in lch, hsl(var(--chart-2)) 10%, transparent)",
											]}
											vertical
										>
											{#snippet children({ gradient })}
												<Area {...getAreaProps(s, i)} fill={gradient} />
											{/snippet}
										</LinearGradient>
									{/each}
								{/snippet}
							</AreaChart>
						</Chart.Container>
					{:else}
						<div class="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
							{m.dashboard_nochartdata2()}
						</div>
					{/if}
				</Card.Content>
				<Card.Footer>
					<div class="flex w-full items-start gap-2 text-sm">
						<div class="grid gap-2">
							<div class="flex items-center gap-2 font-medium leading-none">
								{m.humidity_chart_footer()} <TrendingUp class="size-4" />
							</div>
							<div class="text-muted-foreground flex items-center gap-2 leading-none">
								{m.humidity_chart_footersubtitle1()}
							</div>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>

			<!-- Combined Chart -->
			<Card.Root>
				<Card.Header>
					<Card.Title>{m.combined_title()}</Card.Title>
					<Card.Description>{m.combined_description()}</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if combinedData.length > 0}
						<Chart.Container config={chartConfig}>
							<AreaChart
								data={combinedData}
								x="date"
								xScale={scaleUtc()}
								yPadding={[0, 25]}
								series={[
									{
										key: "humidity",
										label: "Humidity (%)",
										color: "var(--color-humidity)",
									},
									{
										key: "temperature",
										label: "Temperature (°C)",
										color: "var(--color-temperature)",
									}
								]}
								seriesLayout="stack"
								props={{
									area: {
										curve: curveNatural,
										"fill-opacity": 0.4,
										line: { class: "stroke-1" },
										motion: "tween",
									},
									xAxis: {
										format: (v: Date) => v.toLocaleDateString("en-US", { 
											hour: '2-digit', 
											minute: '2-digit' 
										}),
									},
									yAxis: { format: () => "" },
								}}
							>
								{#snippet tooltip()}
									<Chart.Tooltip
										indicator="dot"
										labelFormatter={(v: Date) => {
											return v.toLocaleDateString("en-US", {
												month: "long",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											});
										}}
									/>
								{/snippet}
								{#snippet marks({ series, getAreaProps })}
									{#each series as s, i (s.key)}
										<LinearGradient
											stops={[
												s.color ?? "",
												"color-mix(in lch, " + s.color + " 10%, transparent)",
											]}
											vertical
										>
											{#snippet children({ gradient })}
												<Area {...getAreaProps(s, i)} fill={gradient} />
											{/snippet}
										</LinearGradient>
									{/each}
								{/snippet}
							</AreaChart>
						</Chart.Container>
					{:else}
						<div class="h-[400px] flex items-center justify-center text-slate-500 dark:text-slate-400">
							{m.dashboard_nochartdata2()}
						</div>
					{/if}
				</Card.Content>
				<Card.Footer>
					<div class="flex w-full items-start gap-2 text-sm">
						<div class="grid gap-2">
							<div class="flex items-center gap-2 font-medium leading-none">
								{m.combined_footer()} <TrendingUp class="size-4" />
							</div>
							<div class="text-muted-foreground flex items-center gap-2 leading-none">
								{m.combined_footersubtitle1()}
							</div>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>

			<!-- Refresh Button -->
			<div class="flex justify-center">
				<button 
					onclick={loadData}
					disabled={loading}
					class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
				>
					{#if loading}
						<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
					{/if}
					<span>{loading ? m.dashboard_loading() : m.dashboard_refresh()}</span>
				</button>
			</div>
		{/if}
	</div>
</div>

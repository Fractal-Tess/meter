import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { fetchTemperatureData, fetchCurrentTemperature, fetchAverageTemperature, fetchHumidityData, fetchCurrentHumidity, fetchAverageHumidity, fetchCombinedData } from "@/lib/influxdb";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Thermometer, Droplets } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TemperatureData {
  time: string;
  temperature: number;
}

interface HumidityData {
  time: string;
  humidity: number;
}

interface CombinedData {
  time: string;
  temperature: number;
  humidity: number;
}

export default function Stats() {
  const [currentTemp, setCurrentTemp] = useState<number>(0);
  const [lastTempMeasurementTime, setLastTempMeasurementTime] = useState<string>("");
  const [avgTemp, setAvgTemp] = useState<number>(0);
  const [tempData, setTempData] = useState<TemperatureData[]>([]);
  const [currentHumidity, setCurrentHumidity] = useState<number>(0);
  const [lastHumidityMeasurementTime, setLastHumidityMeasurementTime] = useState<string>("");
  const [avgHumidity, setAvgHumidity] = useState<number>(0);
  const [humidityData, setHumidityData] = useState<HumidityData[]>([]);
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const [currentTempData, avgTempData, tempHistory, currentHumidityData, avgHumidityData, humidityHistory, combinedHistory] = await Promise.all([
          fetchCurrentTemperature(),
          fetchAverageTemperature(),
          fetchTemperatureData(),
          fetchCurrentHumidity(),
          fetchAverageHumidity(),
          fetchHumidityData(),
          fetchCombinedData(),
        ]);
        setCurrentTemp(currentTempData.temperature);
        setLastTempMeasurementTime(currentTempData.time);
        setAvgTemp(avgTempData);
        setTempData(tempHistory);
        setCurrentHumidity(currentHumidityData.humidity);
        setLastHumidityMeasurementTime(currentHumidityData.time);
        setAvgHumidity(avgHumidityData);
        setHumidityData(humidityHistory);
        setCombinedData(combinedHistory);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Възникна грешка при зареждането на данните");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Зареждане...</div>;
  }

  const formatTime = (time: string) => {
    try {
      // Remove nanoseconds from the timestamp if present
      const cleanTime = time.split('.')[0] + 'Z';
      return format(parseISO(cleanTime), "H");
    } catch (error) {
      console.error("Грешка при форматиране на времето:", time, error);
      return "Невалидно време";
    }
  };

  // Calculate temperature trend
  const getTemperatureTrend = () => {
    if (tempData.length < 2) return 0;
    const recentTemp = tempData[tempData.length - 1].temperature;
    const previousTemp = tempData[tempData.length - 2].temperature;
    return ((recentTemp - previousTemp) / previousTemp) * 100;
  };

  // Calculate humidity trend
  const getHumidityTrend = () => {
    if (humidityData.length < 2) return 0;
    const recentHumidity = humidityData[humidityData.length - 1].humidity;
    const previousHumidity = humidityData[humidityData.length - 2].humidity;
    return ((recentHumidity - previousHumidity) / previousHumidity) * 100;
  };

  const tempTrend = getTemperatureTrend();
  const humidityTrend = getHumidityTrend();
  const isTempTrendingUp = tempTrend > 0;
  const isHumidityTrendingUp = humidityTrend > 0;

  const chartConfig = {
    temperature: {
      label: "Температура",
      color: "var(--chart-2)",
    },
    humidity: {
      label: "Влажност",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Текуща Температура</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">
              Последно измерване: {lastTempMeasurementTime ? new Date(lastTempMeasurementTime).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }) : 'Няма данни'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Текуща Влажност</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentHumidity.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Последно измерване: {lastHumidityMeasurementTime ? new Date(lastHumidityMeasurementTime).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }) : 'Няма данни'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средна Температура (6ч)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средна Влажност (6ч)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHumidity.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>История на Температурата (12ч)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={tempData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(time, index) => {
                      const temp = tempData[index]?.temperature;
                      return temp > 0 ? formatTime(time) : '';
                    }}
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    tickFormatter={(value) => `${value.toFixed(1)}°C`}
                  />
                  <Area
                    yAxisId="left"
                    dataKey="temperature"
                    type="natural"
                    fill="url(#fillTemperature)"
                    stroke="var(--chart-2)"
                    name="Температура"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return formatTime(value);
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardContent className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {isTempTrendingUp ? (
                <>
                  Температурата се покачва с {Math.abs(tempTrend).toFixed(1)}% <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Температурата спада с {Math.abs(tempTrend).toFixed(1)}% <TrendingDown className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              Показва температурата за последните 12 часа
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>История на Влажността (24ч)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={humidityData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-3)"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(time, index) => {
                      const humidity = humidityData[index]?.humidity;
                      return humidity > 0 ? formatTime(time) : '';
                    }}
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <Area
                    yAxisId="left"
                    dataKey="humidity"
                    type="natural"
                    fill="url(#fillHumidity)"
                    stroke="var(--chart-3)"
                    name="Влажност"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return formatTime(value);
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardContent className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {isHumidityTrendingUp ? (
                <>
                  Влажността се покачва с {Math.abs(humidityTrend).toFixed(1)}% <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Влажността спада с {Math.abs(humidityTrend).toFixed(1)}% <TrendingDown className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              Показва влажността за последните 24 часа
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Комбинирана История (24ч)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[400px] w-full"
              >
                <AreaChart data={combinedData}>
                  <defs>
                    <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-3)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-3)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(time, index) => {
                      const temp = combinedData[index]?.temperature;
                      return temp > 0 ? formatTime(time) : '';
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    tickFormatter={(value) => `${value.toFixed(1)}°C`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    tickFormatter={(value) => `${value.toFixed(1)}%`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return formatTime(value);
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    yAxisId="left"
                    dataKey="temperature"
                    type="natural"
                    fill="url(#fillTemperature)"
                    stroke="var(--chart-2)"
                    name="Температура (°C)"
                  />
                  <Area
                    yAxisId="right"
                    dataKey="humidity"
                    type="natural"
                    fill="url(#fillHumidity)"
                    stroke="var(--chart-3)"
                    name="Влажност (%)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardContent className="flex-col items-start gap-2 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--chart-2)]" />
                <span className="text-sm">Температура (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
                <span className="text-sm">Влажност (%)</span>
              </div>
            </div>
            <div className="leading-none text-muted-foreground">
              Показва температурата (°C) и влажността (%) за последните 24 часа
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
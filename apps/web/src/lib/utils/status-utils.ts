import * as m from '$lib/paraglide/messages.js';

export function getTemperatureStatus(temp: number): {
  status: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  if (temp < 15)
    return { status: m['temperature.status.cold'](), variant: 'secondary' };
  if (temp > 30)
    return { status: m['temperature.status.hot'](), variant: 'destructive' };
  return { status: m['temperature.status.normal'](), variant: 'default' };
}

export function getHumidityStatus(humidity: number): {
  status: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  if (humidity < 30)
    return { status: m['humidity.status.dry'](), variant: 'secondary' };
  if (humidity > 70)
    return { status: m['humidity.status.humid'](), variant: 'destructive' };
  return { status: m['humidity.status.normal'](), variant: 'default' };
}

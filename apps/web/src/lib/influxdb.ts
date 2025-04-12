// @ts-ignore
import {INFLUX_API_TOKEN, INFLUX_BUCKET, INFLUX_ORG, INFLUX_URL} from 'astro:env/client'
import { parse } from 'csv-parse/browser/esm';

export async function fetchTemperatureData() {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -12h)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "temperature")
      |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch temperature data: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  return (records as any[]).map(record => ({
    time: record._time,
    temperature: parseFloat(record._value)
  }));
}

export async function fetchHumidityData() {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -24h)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "humidity")
      |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch humidity data: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  return (records as any[]).map(record => ({
    time: record._time,
    humidity: parseFloat(record._value)
  }));
}

export async function fetchCurrentTemperature() {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -60m)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "temperature")
      |> last()
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch current temperature: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  if ((records as any[]).length > 0) {
    return {
      temperature: parseFloat((records as any[])[0]._value),
      time: (records as any[])[0]._time
    };
  }
  return { temperature: 0, time: new Date().toISOString() };
}

export async function fetchCurrentHumidity() {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -60m)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "humidity")
      |> last()
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch current humidity: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  if ((records as any[]).length > 0) {
    return {
      humidity: parseFloat((records as any[])[0]._value),
      time: (records as any[])[0]._time
    };
  }
  return { humidity: 0, time: new Date().toISOString() };
}

export async function fetchAverageTemperature() {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -6h)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "temperature")
      |> mean()
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch average temperature: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  if ((records as any[]).length > 0) {
    return parseFloat((records as any[])[0]._value);
  }
  return 0;
}

export async function fetchAverageHumidity() {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -6h)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "humidity")
      |> mean()
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch average humidity: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  if ((records as any[]).length > 0) {
    return parseFloat((records as any[])[0]._value);
  }
  return 0;
}

export async function fetchCombinedData(): Promise<CombinedData[]> {
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -24h)
      |> filter(fn: (r) => r["_measurement"] == "dht11_data")
      |> filter(fn: (r) => r["_field"] == "temperature" or r["_field"] == "humidity")
      |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
  `;

  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_API_TOKEN}`,
      "Content-Type": "application/vnd.flux",
      "Accept": "application/csv",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch combined data: ${response.statusText}`);
  }

  const csv = await response.text();
  const records = await new Promise((resolve, reject) => {
    parse(csv, {
      columns: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  // Group records by time and combine temperature and humidity
  const groupedData = (records as any[]).reduce((acc: { [key: string]: CombinedData }, record) => {
    const time = record._time;
    if (!acc[time]) {
      acc[time] = { time, temperature: 0, humidity: 0 };
    }
    if (record._field === 'temperature') {
      acc[time].temperature = parseFloat(record._value);
    } else if (record._field === 'humidity') {
      acc[time].humidity = parseFloat(record._value);
    }
    return acc;
  }, {});

  return Object.values(groupedData);
}

interface CombinedData {
  time: string;
  temperature: number;
  humidity: number;
} 
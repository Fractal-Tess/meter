# DHT11 Sensor Dashboard

A beautiful, real-time dashboard for monitoring DHT11 temperature and humidity sensor data using SvelteKit, InfluxDB, and ShadCN Svelte charts with gradients.

## Features

- 📊 Real-time temperature and humidity monitoring
- 📈 Beautiful area charts with gradients using ShadCN Svelte
- 🎨 Modern UI with card-based layout and dark mode support
- 🔄 Auto-refresh every 30 seconds
- 📱 Mobile-friendly responsive design
- 🏷️ Status indicators for temperature and humidity levels
- ⚡ Static deployment ready (no backend required)
- 🎯 Built with Svelte 5 runes
- 🌍 Multi-language support with Paraglide (English & Bulgarian)

## Setup

### 1. Install Required ShadCN Components

```bash
npx shadcn-svelte@latest add card chart badge button
```

### 2. Install Additional Dependencies

```bash
npm install @influxdata/influxdb-client @lucide/svelte d3-scale d3-shape
npm install -D @sveltejs/adapter-static
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your InfluxDB configuration:

```env
# InfluxDB Configuration
VITE_INFLUXDB_URL=http://localhost:8086
VITE_INFLUXDB_TOKEN=your-api-token-here
VITE_INFLUXDB_ORG=my-org
VITE_INFLUXDB_BUCKET=sensor-data
VITE_INFLUXDB_MEASUREMENT=dht11_reading
```

### 4. Create InfluxDB API Token

1. Access InfluxDB UI at `http://localhost:8086`
2. Navigate to **Data** → **API Tokens**
3. Click **+ Generate API Token** → **Read/Write API Token**
4. Configure read/write permissions for your bucket
5. Copy the token and update your `.env` file

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Build for Static Deployment

```bash
npm run build
```

The built files will be in the `build` directory, ready for static hosting.

## Data Structure

The dashboard expects DHT11 sensor data in the following format from InfluxDB:

- **Measurement**: `dht11_reading`
- **Tags**: 
  - `location`: Sensor location (e.g., "living-room")
  - `sensor_type`: "DHT11"
- **Fields**:
  - `temperature_celsius`: Temperature in Celsius
  - `temperature_fahrenheit`: Temperature in Fahrenheit
  - `humidity_percent`: Humidity percentage

## Components

### UI Components (ShadCN Svelte)
- `Card`: Layout components with Root, Header, Content, Footer, Title, Description
- `Chart`: Interactive charts with Container, Tooltip, ChartConfig
- `Badge`: Status indicators

### Chart Features
- **Area Charts with Gradients**: Beautiful visualizations using LayerChart
- **Individual Charts**: Separate temperature and humidity charts
- **Combined Chart**: Stacked area chart showing both metrics
- **Interactive Tooltips**: Hover for detailed information
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Updates**: Auto-refreshes data every 30 seconds

### Services
- `InfluxDBClientService`: Client-side InfluxDB connection for static deployment

### Localization
- **Language Switcher**: Dropdown component in the top-right corner
- **Supported Languages**: English (en), Bulgarian (bg)
- **URL Parameters**: `?lang=en` or `?lang=bg` to set language
- **Persistent**: Language preference persists during session

## Status Indicators

### Temperature Status
- **Cold**: < 15°C (Secondary badge)
- **Normal**: 15-30°C (Default badge)
- **Hot**: > 30°C (Destructive badge)

### Humidity Status
- **Dry**: < 30% (Secondary badge)
- **Normal**: 30-70% (Default badge)
- **Humid**: > 70% (Destructive badge)

## Technologies Used

- **SvelteKit**: Frontend framework with static adapter
- **Svelte 5**: Using new runes syntax ($state, $derived)
- **TypeScript**: Type safety
- **ShadCN Svelte**: UI component library
- **Tailwind CSS**: Styling with CSS variables
- **LayerChart**: Advanced charting library
- **D3**: Scale and shape utilities
- **InfluxDB**: Time-series database
- **Lucide Icons**: Beautiful SVG icons
- **Paraglide**: Type-safe internationalization

## Deployment

This dashboard is configured for static deployment and can be hosted on:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `build` folder
- **GitHub Pages**: Upload the `build` directory
- **Any static hosting**: Serve the `build` directory

## Troubleshooting

### No Data Displayed
1. Check InfluxDB connection settings in `.env`
2. Verify InfluxDB is running and accessible
3. Ensure sensor data is being written to the correct bucket
4. Check browser console for error messages
5. Verify CORS settings on InfluxDB allow browser connections

### Charts Not Loading
1. Verify ShadCN components are properly installed
2. Check that chart data format matches expected structure
3. Ensure InfluxDB queries are returning data
4. Check browser network tab for API errors

### Static Build Issues
1. Ensure all environment variables are prefixed with `VITE_`
2. Check that no server-side code is being used
3. Verify static adapter configuration in `svelte.config.js`

### CORS Issues
Configure InfluxDB to allow browser connections by updating your InfluxDB configuration file:

```toml
[http]
  cors-allowed-origins = ["http://localhost:5173", "https://yourdomain.com"]
``` 
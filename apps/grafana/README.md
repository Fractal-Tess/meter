# 📊 Grafana Monitoring Dashboard

Advanced monitoring and analytics dashboard for the Meter IoT sensor monitoring system. Provides real-time visualization, alerting, and historical analysis of temperature and humidity data.

## 🎯 Overview

This Grafana application provides:

- **📈 Real-time Dashboards**: Live monitoring of sensor data
- **🔔 Alerting**: Configurable alerts for temperature and humidity thresholds
- **📊 Advanced Analytics**: Historical data analysis and trends
- **🌍 Multi-location Support**: Monitor multiple sensors across different locations
- **⚡ Performance Metrics**: System performance and sensor health monitoring

## 🏗️ Architecture

The Grafana app is designed to work with the Meter IoT system:

```
Sensor Data → InfluxDB → Grafana → Dashboards & Alerts
```

### Data Flow

1. **Sensors** (ESP8266/Raspberry Pi) collect temperature and humidity data
2. **InfluxDB** stores time-series data with location and device tags
3. **Grafana** queries InfluxDB and displays visualizations
4. **Alerts** are triggered based on configured thresholds

## 📊 Data Structure

The dashboard expects data in the following InfluxDB format:

### Measurement: `dht11_reading`

**Tags:**

- `location`: Sensor location (e.g., "living-room", "bedroom", "kitchen")
- `sensor_type`: Always "DHT11"
- `device`: Device identifier (e.g., "esp_dht11_01", "rp_dht11_01")

**Fields:**

- `temperature`: Temperature in Celsius
- `humidity`: Humidity percentage

**Example Data Point:**

```
dht11_reading,location=living-room,sensor_type=DHT11,device=esp_dht11_01 temperature=23.5,humidity=45.2
```

## 🚀 Quick Start

### Docker Deployment (Recommended)

```bash
# From the project root
docker-compose up grafana -d

# Access Grafana
open http://localhost:3000
```

### Manual Setup

```bash
# Install Grafana (Ubuntu/Debian)
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update
sudo apt install grafana

# Start Grafana service
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Access Grafana
open http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables

```env
# Grafana Configuration
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=admin
GF_USERS_ALLOW_SIGN_UP=false
GF_SERVER_HTTP_PORT=3000

# InfluxDB Connection (configured via UI or datasource)
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-api-token
INFLUXDB_ORG=my-org
INFLUXDB_BUCKET=sensor-data
```

### Initial Setup

1. **Access Grafana**: Navigate to `http://localhost:3000`
2. **Login**: Use default credentials (admin/admin)
3. **Change Password**: Follow the password change prompt
4. **Add Data Source**: Configure InfluxDB connection
5. **Import Dashboards**: Import the provided dashboard JSON

## 📈 Dashboard Features

### Current Status Panel

- **Temperature Display**: Current temperature with color-coded thresholds
- **Humidity Display**: Current humidity with status indicators
- **Last Updated**: Timestamp of most recent reading
- **Device Status**: Online/offline status indicators

### Historical Data Panels

- **Temperature Trend**: 24-hour temperature line chart
- **Humidity Trend**: 24-hour humidity line chart
- **Combined View**: Temperature and humidity overlay chart
- **Statistical Summary**: Min, max, average values

### Multi-Location Support

- **Location Filter**: Dropdown to select specific sensor locations
- **Device Filter**: Filter by specific device IDs
- **Aggregated View**: Combined data from all sensors

### Alerting Configuration

- **Temperature Alerts**:
  - High temperature warning (>30°C)
  - Low temperature warning (<10°C)
- **Humidity Alerts**:
  - High humidity warning (>80%)
  - Low humidity warning (<20%)
- **Device Offline**: Alert when sensor stops reporting

## 🔧 Customization

### Adding New Panels

1. **Edit Dashboard**: Click the edit button in Grafana
2. **Add Panel**: Click "Add panel" button
3. **Configure Query**: Use Flux query language for InfluxDB
4. **Set Visualization**: Choose chart type and styling
5. **Save**: Save the panel to the dashboard

### Example Flux Queries

**Latest Temperature:**

```flux
from(bucket: "sensor-data")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "dht11_reading")
  |> filter(fn: (r) => r._field == "temperature")
  |> last()
```

**24-Hour Average Temperature:**

```flux
from(bucket: "sensor-data")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "dht11_reading")
  |> filter(fn: (r) => r._field == "temperature")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
```

**Temperature by Location:**

```flux
from(bucket: "sensor-data")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "dht11_reading")
  |> filter(fn: (r) => r._field == "temperature")
  |> filter(fn: (r) => r.location == "living-room")
```

### Alert Rules

**High Temperature Alert:**

```flux
from(bucket: "sensor-data")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "dht11_reading")
  |> filter(fn: (r) => r._field == "temperature")
  |> filter(fn: (r) => r._value > 30)
```

## 📁 File Structure

```
apps/grafana/
├── README.md                    # This file
├── provisioning/
│   ├── dashboards/
│   │   ├── dashboard.yml        # Dashboard provisioning config
│   │   ├── dht11-dashboard.json # Legacy dashboard definition
│   │   └── meter-dashboard.json # Updated dashboard definition
│   └── datasources/
│       └── influxdb.yml         # InfluxDB datasource config
└── .env.example                 # Environment variables template
```

## 🔗 Integration

### With Web Dashboard

- **Shared Data Source**: Both use the same InfluxDB instance
- **Complementary Views**: Web dashboard for quick overview, Grafana for detailed analysis
- **Real-time Updates**: Both update automatically as new data arrives

### With Sensor Applications

- **ESP8266**: Sends data directly to InfluxDB
- **Raspberry Pi**: Sends data directly to InfluxDB
- **Data Consistency**: All applications use the same data format

## 🚨 Troubleshooting

### Dashboard Not Loading Data

1. **Check Data Source**: Verify InfluxDB connection in Grafana
2. **Verify Data**: Check if sensors are sending data to InfluxDB
3. **Check Queries**: Ensure Flux queries match your data structure
4. **Time Range**: Verify the dashboard time range includes your data

### Alerts Not Triggering

1. **Check Alert Rules**: Verify alert conditions and thresholds
2. **Notification Channels**: Configure email, Slack, or other notification methods
3. **Alert State**: Check if alerts are paused or disabled
4. **Data Availability**: Ensure data is being received within alert timeframes

### Performance Issues

1. **Query Optimization**: Use appropriate time ranges and aggregations
2. **Data Retention**: Configure InfluxDB retention policies
3. **Resource Limits**: Monitor Grafana server resources
4. **Caching**: Enable query caching for better performance

## 🔒 Security

- **Authentication**: Admin user with secure password
- **Data Access**: Read-only access to InfluxDB data
- **Network Security**: Configure firewall rules for Grafana port
- **HTTPS**: Enable SSL/TLS for production deployments

## 📚 Additional Resources

- [Grafana Documentation](https://grafana.com/docs/)
- [InfluxDB Flux Language](https://docs.influxdata.com/flux/)
- [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/)
- [Time Series Best Practices](https://grafana.com/docs/grafana/latest/best-practices/)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

---

**Built for the Meter IoT monitoring system**

# Use Python 3.11 slim image optimized for ARM64 (Raspberry Pi)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for GPIO access and building packages
RUN apt-get update && apt-get install -y \
    python3-dev \
    build-essential \
    libgpiod2 \
    libgpiod-dev \
    gpiod \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install uv for faster dependency management
RUN pip install uv

# Copy uv configuration files
COPY pyproject.toml uv.lock* ./

# Install Python dependencies using uv
RUN uv pip install --system adafruit-circuitpython-dht rpi-gpio influxdb-client

# Copy application code
COPY main.py .

# Note: Running as root is required for GPIO access in containers
# In production, you might want to use a more secure approach with proper device permissions

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Expose any ports if needed (not required for this sensor app)
# EXPOSE 8000

# Health check to verify the application can import required modules
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import board, adafruit_dht; print('Health check passed')" || exit 1

# Default command
CMD ["python", "main.py"] 
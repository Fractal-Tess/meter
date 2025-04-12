// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  env: {
    schema: {
      INFLUX_API_TOKEN: {
        default: "kfUhLti4JqRPanFhJ82CAfbZwTWbUxUkL13N0JyRaW2CP2qoMag6kkg-vcKliiDs05xjpZCxihQJTvK4zLCVEg==",
        access: 'public',
        context: 'client',
        type: 'string',
      },
      INFLUX_URL: {
        default: "https://us-east-1-1.aws.cloud2.influxdata.com",
        access: 'public',
        context: 'client',
        type: 'string',
      },
      INFLUX_ORG: {
        default: "1395e6e574f8a16e",
        access: 'public',
        context: 'client',
        type: 'string',
      },
      INFLUX_BUCKET: {
        default: "greenhouse_1",
        access: 'public',
        context: 'client',
        type: 'string',
      },
    }
  },
  vite: {
    plugins: [tailwind()],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
      },
    },
  },
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  server: {
    host: true,
    port: 4321,
  },
});

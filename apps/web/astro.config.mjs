// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@tailwindcss/vite";
import react from "@astrojs/react";
import { VitePWA } from 'vite-plugin-pwa';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  env: {
    schema: {
      INFLUX_API_TOKEN: envField.string({
        context: 'client',
        access: 'public',
        default: 'kfUhLti4JqRPanFhJ82CAfbZwTWbUxUkL13N0JyRaW2CP2qoMag6kkg-vcKliiDs05xjpZCxihQJTvK4zLCVEg=='
      }),
      INFLUX_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://us-east-1-1.aws.cloud2.influxdata.com'
      }),
      INFLUX_ORG: envField.string({
        context: 'client',
        access: 'public',
        default: '1395e6e574f8a16e'
      }),
      INFLUX_BUCKET: envField.string({
        context: 'client',
        access: 'public',
        default: 'greenhouse_1'
      })
    }
  },
  vite: {
    plugins: [
      tailwind(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Temperature Monitoring',
          short_name: 'TempMon',
          description: 'Temperature and Humidity Monitoring System',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallbackAllowlist: [/^\/$/]
        }
      })
    ],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
      },
    },
  },
  site: 'https://fractal-tess.github.io',
  base: '/meter',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  server: {
    host: true,
    port: 4321,
  },
});

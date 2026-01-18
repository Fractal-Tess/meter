import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { z } from 'zod';

const env = z
  .object({
    PUBLIC_ORIGIN: z.url({
      error: 'PUBLIC_ORIGIN must be a valid URL',
    }),
  })
  .parse({
    PUBLIC_ORIGIN: process.env.PUBLIC_ORIGIN || 'https://localhost',
  });

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
    }),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      injectRegister: 'auto',
      manifest: {
        id: '/',
        lang: 'en',
        dir: 'ltr',
        prefer_related_applications: false,
        related_applications: [],
        edge_side_panel: {
          preferred_width: 400,
        },
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View your meter dashboard',
            url: env.PUBLIC_ORIGIN,
            icons: [
              {
                src: 'icons/manifest-icon-192.maskable.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
        ],
        screenshots: [
          {
            src: 'screenshots/dashboard-light.png',
            sizes: '1280x720',
            type: 'image/png',
            label: 'Dashboard (Light Mode)',
            platform: 'wide',
          },
          {
            src: 'screenshots/dashboard-dark.png',
            sizes: '1280x720',
            type: 'image/png',
            label: 'Dashboard (Dark Mode)',
            platform: 'wide',
          },
          {
            src: 'screenshots/mobile-light.png',
            sizes: '375x812',
            type: 'image/png',
            label: 'Mobile (Light Mode)',
            platform: 'narrow',
          },
          {
            src: 'screenshots/mobile-dark.png',
            sizes: '375x812',
            type: 'image/png',
            label: 'Mobile (Dark Mode)',
            platform: 'narrow',
          },
        ],
        name: 'Meter Dashboard',
        short_name: 'Meter',
        description: 'IoT Meter Dashboard - Real-time monitoring and analytics',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: env.PUBLIC_ORIGIN,
        start_url: env.PUBLIC_ORIGIN,
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: 'icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
    visualizer({
      open: true,
      filename: 'stats.html',
    }),
  ],
});

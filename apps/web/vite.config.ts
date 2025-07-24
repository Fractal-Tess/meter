import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      injectRegister: 'auto',
      manifest: {
        name: 'Meter Dashboard',
        short_name: 'Meter',
        description: 'IoT Meter Dashboard - Real-time monitoring and analytics',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: 'meter-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
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

import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';

/**
 * Static files that must keep their repo-root paths:
 * - images/ is referenced by raw.githubusercontent.com URLs stored in Firestore
 * - admin.html / dashboard.html are the legacy (non-bundled) admin panel
 * In dev Vite serves them straight from the project root; on build we copy them into dist/.
 */
const STATIC_ENTRIES = [
  '.htaccess',
  'images',
  'Docs',
  'admin.html',
  'dashboard.html',
  'data-manager.js',
  'analytics.js',
  'admin-styles.css',
  'admin-app.js',
  'admin-model.js',
  'styles.css',
];

function copyStatic(): Plugin {
  return {
    name: 'copy-legacy-static',
    apply: 'build',
    closeBundle() {
      for (const entry of STATIC_ENTRIES) {
        const from = resolve(import.meta.dirname, entry);
        if (existsSync(from)) cpSync(from, resolve(import.meta.dirname, 'dist', entry), { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: '/',
  publicDir: false,
  plugins: [tailwindcss(), copyStatic()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'index.html'),
    },
  },
});

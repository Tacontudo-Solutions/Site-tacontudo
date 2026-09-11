/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      // Multi-page: cada entrada vira um HTML estático próprio (bom p/ SEO)
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        'nossa-estrutura': fileURLToPath(new URL('./nossa-estrutura/index.html', import.meta.url)),
        rpa: fileURLToPath(new URL('./rpa/index.html', import.meta.url)),
        privacidade: fileURLToPath(new URL('./politica-de-privacidade/index.html', import.meta.url)),
        cookies: fileURLToPath(new URL('./politica-de-cookies/index.html', import.meta.url)),
        blog: fileURLToPath(new URL('./blog/index.html', import.meta.url)),
        'blog-quanto-custa-ignorar-o-qa': fileURLToPath(new URL('./blog/quanto-custa-ignorar-o-qa/index.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    // Permite acesso via túneis públicos (Cloudflare, Localtunnel, etc)
    allowedHosts: true,
  },
})

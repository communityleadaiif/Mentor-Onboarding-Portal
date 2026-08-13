import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative asset paths so it works on any host/subpath (GitHub Pages, Netlify, Surge, Vercel, Mobile)
  plugins: [
    react(),
    tailwindcss(),
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig(() => {
  const port = Number.parseInt(process.env.VITE_PORT ?? '', 10) || 3333

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Alias '@' to point to the src directory
      }
    },
    server: {
      port,
      strictPort: true,
    },
    preview: {
      port,
    },
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path" // <-- Add this import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { // <-- Add this whole "resolve" section
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
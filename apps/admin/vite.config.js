import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        host: '127.0.0.1',
        allowedHosts: ['.csb.app', 'd3wqxd-5174.csb.app'],
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:4000',
                changeOrigin: true,
            }
        }
    }
})

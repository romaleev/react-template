import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { ViteDevServer } from 'vite'
import dotenv from 'dotenv'
import tsconfigPaths from 'vite-tsconfig-paths'

const env = dotenv.config({ path: './.env' })

export default defineConfig({
	plugins: [
		tsconfigPaths({
			projects: ['./tsconfig.json'],
		}),
		react(),
		{
			name: 'custom-api-server',
			configureServer(server: ViteDevServer) {
				server.middlewares.use('/api/register', (req, res, next) => {
					if (req.method !== 'POST') return next()

					let body = ''
					req.on('data', (chunk) => {
						body += chunk
					})

					req.on('end', () => {
						try {
							const parsed = JSON.parse(body)
							res.setHeader('Content-Type', 'application/json')
							res.end(JSON.stringify({ message: 'Registered!', data: parsed }))
						} catch (error: unknown) {
							res.statusCode = 400
							res.end(JSON.stringify({ error }))
						}
					})
				})
			},
		},
	],
	server: {
		port: parseInt(env.parsed?.CLIENT_PORT || '4100'),
	},
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor'
					}
				},
			},
		},
	},
	resolve: {
		alias: {
			'#root': path.resolve(__dirname),
			'#src': path.resolve(__dirname, 'src'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './vite.test.ts',
		include: ['src/**/*.spec.{ts,tsx}'],
	},
})

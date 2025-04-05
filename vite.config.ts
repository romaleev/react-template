import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { TsconfigRaw } from 'esbuild'
import tsconfigRawData from './tsconfig.build.json' assert { type: 'json' }
import { ViteDevServer } from 'vite'
import * as dotenv from 'dotenv'

const tsconfigRaw: TsconfigRaw = tsconfigRawData as TsconfigRaw

const env = dotenv.config({ path: './.env' })

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'custom-api-server',
			configureServer(server: ViteDevServer) {
				// Add custom API route
				server.middlewares.use('/api/register', async (req, res, next) => {
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
		port: parseInt(env.parsed?.CLIENT_PORT || '4200'),
	},
	build: {
		chunkSizeWarningLimit: 600, // Adjust chunk size limit
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor' // General vendor chunk
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
	esbuild: {
		tsconfigRaw,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './vite.test.ts',
		include: ['src/**/*.spec.{ts,tsx}'],
	},
})

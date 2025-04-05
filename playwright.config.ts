import * as dotenv from 'dotenv'
import { defineConfig } from '@playwright/test'

const env = dotenv.config({ path: './.env' })

export default defineConfig({
	testDir: './e2e',
	timeout: 30000, // 60 seconds timeout
	fullyParallel: true,
	reporter: [['html', { outputFolder: 'playwright-report' }]],
	use: {
		headless: true, // Set to false to see the browser UI
		viewport: { width: 1280, height: 720 },
		actionTimeout: 10000,
		trace: 'on',
		video: 'on',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'local',
			outputDir: 'test-results/local',
			use: {
				baseURL: `http://localhost:${env.parsed.CLIENT_PORT}`,
			},
		},
	],
})

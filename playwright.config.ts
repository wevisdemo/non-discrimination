import { defineConfig } from '@playwright/test';

export default defineConfig({
	// The build processes every map image, so on a CI runner it can pass Playwright's 60s default
	webServer: { command: 'pnpm build && pnpm preview', port: 4173, timeout: 240_000 },
	use: { baseURL: 'http://localhost:4173' },
	testMatch: '**/*.e2e.{ts,js}'
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  timeout: 30000,
  webServer: [
    {
      command: 'yarn dev',
      cwd: '../server',
      port: 4000,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'yarn dev',
      cwd: '.',
      port: 5173,
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    
  // ... other configurations
  retries: 3, // retry failed tests up to 3 times
  use: {
    launchOptions: {
      headless: process.env.CI ? true : false,
      args: ["--start-maximized"]
    },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    
  // ... other configurations
  retries: 3, // retry failed tests up to 3 times
  use: {
    headless: false,
    launchOptions: {    args: ["--start-maximized"],},
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  
});
import { Browser } from '@playwright/test';

export async function cleanupBrowsers(browserInstances: Browser[]) {
    for (const browser of browserInstances) {
        for (const context of browser.contexts()) {
            for (const page of context.pages()) {
                if (page.url() === 'about:blank') {
                    try {
                        await page.close();
                    } catch (error) {
                        console.error('Error closing about:blank page:', error);
                    }
                }
            }
        }
        try {
            await browser.close();
        } catch (error) {
            console.error('Error closing browser:', error);
        }
    }
}

import { AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { ICustomWorld } from './custom-world';
import { cleanupBrowsers } from '../utils/helpers';
import { AllPagesObject } from '../pages/all-pages-object';

setDefaultTimeout(60 * 1000);

const browserInstances: Browser[] = [];

Before(async function (this: ICustomWorld) {
    const newBrowser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
    browserInstances.push(newBrowser);

    this.context = await newBrowser.newContext({ viewport: { width: 1920, height: 1080 } });
    this.page = await this.context.newPage();
    this.pagesObj = new AllPagesObject(this.page, this.page.context());
});

After(async function (this: ICustomWorld) {
    const browser = this.page?.context().browser();
    if (browser) {
        await browser.close();
        const idx = browserInstances.indexOf(browser);
        if (idx !== -1) browserInstances.splice(idx, 1);
    }
});

AfterAll(async () => {
    await cleanupBrowsers(browserInstances);
});

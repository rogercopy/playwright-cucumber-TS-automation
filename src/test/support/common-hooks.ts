import { AfterAll, Before, After, BeforeAll, setDefaultTimeout, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { ICustomWorld } from './custom-world';
import { cleanupBrowsers } from '../utils/helpers';
import { AllPagesObject } from '../pages/all-pages-object';
import { LoginPage } from '../pages/login.page';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

setDefaultTimeout(60 * 1000);

const browserInstances: Browser[] = [];
const AUTH_STATE_PATH = 'auth-state.json';

BeforeAll({ timeout: 120 * 1000 }, async function () {
    const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    const loginPage = new LoginPage(page, context);
    await loginPage.loginToTrelloAccount();

    await context.storageState({ path: AUTH_STATE_PATH });
    await browser.close();
});

Before(async function (this: ICustomWorld) {
    const newBrowser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
    browserInstances.push(newBrowser);

    this.context = await newBrowser.newContext({
        viewport: { width: 1920, height: 1080 },
        ...(existsSync(AUTH_STATE_PATH) ? { storageState: AUTH_STATE_PATH } : {})
    });
    this.page = await this.context.newPage();
    this.pagesObj = new AllPagesObject(this.page, this.page.context());
});

After(async function (this: ICustomWorld, { result, pickle }: ITestCaseHookParameter) {
    if (result?.status === Status.FAILED && this.page) {
        try {
            mkdirSync('screenshots', { recursive: true });
            const safeName = pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const path = join('screenshots', `${safeName}_${Date.now()}.png`);
            await this.page.screenshot({ path, fullPage: true });
            console.log(`📸 Screenshot saved: ${path}`);
        } catch (err) {
            console.error('Failed to capture screenshot:', err);
        }
    }
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

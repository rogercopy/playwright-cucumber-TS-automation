import { AfterAll, BeforeAll, Before, After, Given, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';
import { cleanupBrowsers } from '../utils/helpers';
import { trello2FASetupKey } from '../utils/constants';
import { AllPagesObject } from '../pages/all-pages-object';
import { authenticator } from 'otplib';

setDefaultTimeout(60 * 1000);

// Global array to hold all browser instances launched during the tests
const browserInstances: Browser[] = [];

Before(async function (this: ICustomWorld) {
  // Launch a new browser and store it in our global array
  const newBrowser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  browserInstances.push(newBrowser);

  this.context = await newBrowser.newContext();
  this.page = await newBrowser.newPage();
  this.pagesObj = new AllPagesObject(this.page, this.page.context());
});

Then('Verify the OTP via 2FA authentication', async function(this: ICustomWorld){
    await this.page?.waitForTimeout(2000);
    await this.page?.getByRole('textbox', { name: '-digit verification code' }).click();
    const totp = authenticator.generate(trello2FASetupKey);
    await this.page?.getByRole('textbox', { name: '-digit verification code' }).fill(totp);
})

Given('Login to your Trello Account', async function (this: ICustomWorld) {
    await this.pagesObj?.loginPage.loginToTrelloAccount();
});

AfterAll(async () => {
    await cleanupBrowsers(browserInstances);
});
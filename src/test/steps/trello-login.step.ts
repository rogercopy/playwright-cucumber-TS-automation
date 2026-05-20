import { Given, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/custom-world';
import { trello2FASetupKey } from '../utils/constants';
import { authenticator } from 'otplib';

Then('Verify the OTP via 2FA authentication', async function (this: ICustomWorld) {
    await this.page?.waitForTimeout(2000);
    await this.page?.getByRole('textbox', { name: '-digit verification code' }).click();
    const totp = authenticator.generate(trello2FASetupKey);
    await this.page?.getByRole('textbox', { name: '-digit verification code' }).fill(totp);
});

Given('Login to your Trello Account', async function (this: ICustomWorld) {
    await this.pagesObj?.loginPage.loginToTrelloAccount();
});

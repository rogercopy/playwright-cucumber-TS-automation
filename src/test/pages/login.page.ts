// pages/login.page.ts
import { BrowserContext, Locator, Page } from "@playwright/test";
import { authenticator } from "otplib";
import {
  trelloLoginEmail,
  trelloLoginPassword,
  trelloUIHost,
  trello2FASetupKey,
} from "../utils/constants";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  private homePageLoginBtn: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private submitLoginBtn: Locator;
  private viewCloseBoardsBtn: Locator;
  private deleteBoardBtn: Locator;
  private confirmDeleteBoardBtn: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    this.homePageLoginBtn = page.getByRole('link', { name: 'Log in', exact: true });
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.submitLoginBtn = page.getByTestId('login-submit-idf-testid');
    this.viewCloseBoardsBtn = this.page.getByRole("button", {
      name: "View all closed boards",
    });
    this.deleteBoardBtn = this.page.getByTestId(
      "close-board-delete-board-button"
    );
    this.confirmDeleteBoardBtn = this.page.getByTestId(
      "close-board-delete-board-confirm-button"
    );
  }

  public async loginToTrelloAccount() {
    await this.page.goto(trelloUIHost);
    await this.homePageLoginBtn.click();

    await this.usernameInput.fill(trelloLoginEmail);
    await this.submitLoginBtn.click();

    await this.passwordInput.fill(trelloLoginPassword);
    await this.submitLoginBtn.click();

    // const totp = authenticator.generate(trello2FASetupKey);
    // await this.page
    //   ?.getByRole("textbox", { name: "-digit verification code" })
    //   .fill(totp);
    // const errorLocator = this.page?.locator('#otpCode-uid17-error');

    // // Check if the error is visible
    // while (await errorLocator.isVisible()) {
    //   const errorText = await errorLocator.innerText();

    //   if (errorText.includes('You entered an incorrect verification code.')) {
    //     console.log('⚠️ Incorrect verification code detected — retrying with fresh TOTP.');
    //     const otpInput = this.page?.getByRole("textbox", { name: "-digit verification code" });
    //     await otpInput?.clear();
    //     await otpInput?.fill(authenticator.generate(trello2FASetupKey));
    //     await this.page?.waitForTimeout(3000);
    //   } else {
    //     break;
    //   }
    // }

    const totp = authenticator.generate(trello2FASetupKey);
await this.page
  ?.getByRole("textbox", { name: "-digit verification code" })
  .fill(totp);

const errorLocator = this.page?.locator('[id$="-error"]'); // match dynamic ID by suffix
const submitButton = this.page?.getByRole("button", { name: /verify/i }); // adjust selector

const maxRetries = 3;
let attempts = 0;

while (attempts < maxRetries && await errorLocator.isVisible()) {
  const errorText = await errorLocator.innerText();

  if (errorText.includes('You entered an incorrect verification code.')) {
    console.log(`⚠️ Incorrect TOTP — retry attempt ${attempts + 1}`);

    // Wait until we're in a fresh TOTP window (at least 5s buffer)
    const secondsRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);
    const waitMs = (secondsRemaining + 2) * 1000; // +2s buffer
    console.log(`⏳ Waiting ${waitMs / 1000}s for fresh TOTP window...`);
    await this.page?.waitForTimeout(waitMs);

    const freshTotp = authenticator.generate(trello2FASetupKey);
    const otpInput = this.page?.getByRole("textbox", { name: "-digit verification code" });
    await otpInput?.clear();
    await otpInput?.fill(freshTotp);
    await submitButton?.click(); // 👈 this was missing
    await this.page?.waitForTimeout(1500); // let the response settle
  } else {
    break;
  }

  attempts++;
}

if (attempts === maxRetries) {
  throw new Error('TOTP verification failed after max retries');
}

    await this.page?.getByText('Log in', { exact: true }).click();

    const dismissButton = this.page.getByRole('button', { name: 'Dismiss' });
    const viewUpdatesButton = this.page.getByRole('button', { name: 'View updates' });
    if (await dismissButton.isVisible({ timeout: 10000 }).catch(() => false)) {
      await dismissButton.click();
    } else if (await viewUpdatesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await viewUpdatesButton.click();
      await this.page.getByRole('button', { name: 'Close dialog' }).click();
    }
  }

  public async clearClosedBoards() {
    await this.viewCloseBoardsBtn.click();
    await this.page?.waitForTimeout(2000);
    for (const deleteElement of await this.deleteBoardBtn.all()) {
      await deleteElement.click();
      await this.confirmDeleteBoardBtn.click();
    }
  }
}

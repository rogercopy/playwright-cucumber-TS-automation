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

    const needsLogin = await this.homePageLoginBtn
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (!needsLogin) {
      return;
    }

    await this.homePageLoginBtn.click();

    await this.usernameInput.fill(trelloLoginEmail);
    await this.submitLoginBtn.click();

    await this.passwordInput.fill(trelloLoginPassword);
    await this.submitLoginBtn.click();

    const otpInput = this.page.getByRole("textbox", { name: "-digit verification code" });
    const errorLocator = this.page.getByTestId('form-text-field--input-invalid-error-message-field--idf-testid');
    const otpLoginButton = this.page.getByRole('button', { name: 'Log in' });

    await otpInput.fill(authenticator.generate(trello2FASetupKey));
    await otpLoginButton.click();

    const errorAppeared = () =>
      errorLocator.waitFor({ state: 'visible', timeout: 7000 })
        .then(() => true)
        .catch(() => false);

    let attempts = 0;
    while ((await errorAppeared()) && attempts < 2) {
      attempts++;
      const errorText = await errorLocator.innerText();
      if (!errorText.includes('You entered an incorrect verification code.')) {
        break;
      }
      console.log(`⚠️ OTP rejected (attempt ${attempts}) — waiting for fresh TOTP window.`);
      await this.page.waitForTimeout(32000);
      await otpInput.clear();
      await otpInput.fill(authenticator.generate(trello2FASetupKey));
      await otpLoginButton.click();
    }

    const dismissButton = this.page.getByRole('button', { name: 'Dismiss' });
    const viewUpdatesButton = this.page.getByRole('button', { name: 'View updates' });
    const dismissed = await dismissButton
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    if (dismissed) {
      await dismissButton.click();
    } else {
      const updatesShown = await viewUpdatesButton
        .waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      if (updatesShown) {
        await viewUpdatesButton.click();
        await this.page.getByRole('button', { name: 'Close dialog' }).click();
      }
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

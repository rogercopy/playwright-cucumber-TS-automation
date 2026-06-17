import { Page, BrowserContext, Locator } from "@playwright/test";
import { join } from "path";

export class BasePage {
  page: Page;
  context: BrowserContext;
  header: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.header = this.page.locator("h1");
  }

  public screenshot(name: string): Promise<Buffer> | undefined {
    return this.page.screenshot({ path: join("screenshots", `${name}.png`) });
  }

  public async getPageUrl(): Promise<string> {
    await this.page.waitForTimeout(2000);
    return this.page.url();
  }

  public async getHeaderText(): Promise<string> {
    return await this.header.innerText();
  }

  public async waitForHeaderHavingText(headerString: string) {
    await this.page.locator("h1", { hasText: headerString }).waitFor({ state: "visible" });
  }

  public async refreshPage() {
    await this.page.waitForTimeout(3000);
    await this.page.reload();
  }

  public async isTextVisible(textString: string) {
    await this.page.getByText(textString).waitFor({ state: "visible" });
    return await this.page.getByText(textString).isVisible();
  }

  public async isTextNotVisible(textString: string) {
    await this.page.waitForTimeout(1000);
    return !(await this.page.getByText(textString).isVisible());
  }

  public async clickContinueButton() {
    await this.page.getByRole("button", { name: "CONTINUE" }).click();
  }

  public async clickOnMenuItem(label: string){
    await this.page.getByRole("menuitem", { name: label }).click();
  }
}
import { expect } from '@playwright/test';
import { Page } from './basePage';
import messages from '../datafactory/messages';
import { Page as PlaywrightPage } from '@playwright/test';

export class HomePage extends Page {
  protected readonly url: string;
  constructor(page: PlaywrightPage) {
    super(page);
    this.url = '/';
  }
  async goto() {
    await this.page.goto(this.url);
  }

  async returnToHomePage() {
    await this.navBar.returnHome();
  }

  async loginSuccess() {
    await expect(this.page.getByText(messages.login.success)).toBeVisible();
  }

  async signupSuccess() {
    await expect(this.page.getByText(messages.signup.success)).toBeVisible();
  }

  async checkInvalidCredentials() {
    await expect(this.page.getByText(messages.login.invalid)).toBeVisible();
  }
}

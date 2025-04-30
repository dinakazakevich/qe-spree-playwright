import { expect } from '@playwright/test';
import { Page } from './basePage';
import { LoginForm } from '../components/loginForm';
import { NavigationBar } from '../components/navigationComponent';
import messages from '../datafactory/messages';
import { SignupForm } from '../components/signupForm';

export class LoginPage extends Page {
  public readonly navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginForm(this.page.locator('#login'));
  // Login and Signup have the same host locator since they are sharing the same UI and form, duplicating for convenience.
  public readonly signupForm = new SignupForm(this.page.locator('#login'));

  async goto() {
    await this.page.goto('/users/sign_in');
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

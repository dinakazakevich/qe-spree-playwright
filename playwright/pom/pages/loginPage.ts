import { expect } from '@playwright/test';
import { Page } from './basePage';
import { LoginForm } from '../components/loginForm';
import { NavigationBar } from '../components/navigationComponent';
import messages from '../../lib/utils/messages';
import { SignupForm } from '../components/signupForm';
import { type Page as PlaywrightPage } from 'playwright';
import { type User } from '../../lib/types/user';

export class LoginPage extends Page {
  public readonly navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginForm(this.page.locator('#login'));
  // Login and SignUp have the same locator since they are sharing the same UI and form, duplicating for convenience.
  public readonly SignupForm = new SignupForm(this.page.locator('#login'));
  readonly user: User;

  constructor(page: PlaywrightPage, user: User) {
    super(page);
    this.user = user;
  }

  async goto() {
    await this.page.goto('/users/sign_in');
  }
  async loginSuccess() {
    await expect(this.page.getByText(messages.login.success)).toBeVisible();
  }

  async signUpSuccess() {
    await expect(this.page.getByText(messages.signup.success)).toBeVisible();
  }

  async checkInvalidCredentials() {
    await expect(this.page.getByText(messages.login.invalid)).toBeVisible();
  }
}

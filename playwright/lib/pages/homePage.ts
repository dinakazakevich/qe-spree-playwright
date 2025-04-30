import { expect } from '@playwright/test';
import { Page } from './basePage';
// import { LoginForm } from '../components/loginForm';
// import { NavigationBar } from '../components/navigationComponent';
// import { CartComponent } from '../components/cartComponent';
import messages from '../datafactory/messages';

export class HomePage extends Page {
  // public readonly navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  // public readonly loginForm = new LoginForm(this.page.locator('#login'));
  // public readonly cartSidebar = new CartComponent(this.page.locator('#slideover-cart'));

  async goto() {
    await this.page.goto('/');
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

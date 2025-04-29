import { expect } from '@playwright/test';
import { Page } from './basePage';
import { LoginForm } from '../components/loginForm';
import { NavigationBar } from '../components/navigationComponent';
import { CartComponent } from '../components/cartComponent';
import messages from '../../lib/utils/messages';

export class HomePage extends Page {
  private url = '/';
  public readonly navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginForm(this.page.locator('#login'));
  public readonly cartSidebar = new CartComponent(this.page.locator('#slideover-cart'));

  async goto() {
    await this.page.goto(this.url);
  }

  async returnToHomePage() {
    await this.navBar.returnHome();
  }

  async loginSuccess() {
    await expect(this.page.getByText(messages.login.success)).toBeVisible();
  }

  async checkInvalidCredentials() {
    await expect(this.page.getByText(messages.login.invalid)).toBeVisible();
  }
}

import { Page } from './basePage';
import { LoginForm } from '../components/loginForm';
import { NavigationBar } from '../components/navigationComponent';

export class pageName extends Page {
  public readonly navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginForm(this.page.locator('#login'));

  async goto() {
    await this.page.goto('/path');
  }

  async method1() {
    /*...*/
  }

  async method2() {
    /*...*/
  }
}

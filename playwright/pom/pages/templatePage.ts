import { Page } from './basePage';
import { LoginComponent } from '../components/loginForm';
import { navigationBar } from '../components/navigationComponent';

export class pageName extends Page {
  public readonly navBar = new navigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginComponent(this.page.locator('#login'));

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

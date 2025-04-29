import { Page } from './basePage';
import { LoginForm } from '../components/loginForm';
import { NavigationBar } from '../components/navigationComponent';
import { mathRandom } from '../../lib/utils/testData';

export class ProductsPage extends Page {
  public readonly navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginForm(this.page.locator('#login'));

  async goto() {
    await this.page.goto('/products');
  }

  async selectProduct() {
    // Select a random product on the page
    const randomNumber: number = mathRandom(1, 20);
    await this.page.locator(`#product-${randomNumber}`).click();
  }

  async method2() {
    /*...*/
  }
}

import { Page } from './basePage';
import { LoginForm } from '../components/loginForm';
import { NavigationBar } from '../components/navigationComponent';
import { CartComponent } from '../components/cartComponent';

export class ProductDetailsPage extends Page {
  public readonly navBar = new navigationBar(this.page.getByRole('navigation', { name: 'Top' }));
  public readonly loginForm = new LoginComponent(this.page.locator('#login'));
  public readonly cartSidebar = new cartSidebarComponent(this.page.locator('#slideover-cart'));

  async goto(url: string) {
    await this.goto(url);
  }

  async increaseQuantity() {
    await this.page.locator('button.increase-quantity').click();
  }

  async selectSize(size: string) {
    await this.page.getByRole('button', { name: 'Please choose Size' }).click();
    await this.page.locator('label').filter({ hasText: size }).click();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add To Cart' }).click();
  }
}

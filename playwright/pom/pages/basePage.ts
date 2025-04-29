import { type Page as PlaywrightPage } from 'playwright';
import { NavigationBar } from '../components/navigationComponent';
import { LoginForm } from '../components/loginForm';
import { CartComponent } from '../components/cartComponent';

export abstract class Page {
  public readonly page: PlaywrightPage;
  public readonly navBar: NavigationBar;
  public readonly loginForm: LoginForm;
  public readonly cartSidebar: CartComponent;

  constructor(page: PlaywrightPage) {
    this.page = page;
    this.navBar = new NavigationBar(this.page.getByRole('navigation', { name: 'Top' }));
    this.loginForm = new LoginForm(this.page.locator('#login'));
    this.cartSidebar = new CartComponent(this.page.locator('#slideover-cart'));
  }
  async close() {
    await this.page.close();
  }
}

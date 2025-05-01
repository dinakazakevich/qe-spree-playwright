import { Page } from './basePage';
import { mathRandom } from '../helpers/utils';
import { Page as PlaywrightPage } from '@playwright/test';

export class ProductsPage extends Page {
  protected readonly url: string;
  constructor(page: PlaywrightPage) {
    super(page);
    this.url = '/products';
  }
  async goto() {
    await this.page.goto(this.url);
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

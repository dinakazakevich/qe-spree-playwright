import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { ProductDetailsPage } from '../pages/productsDetailsPage';
import { User } from '../types/types';

export type TestOptions = {
  loginPage: LoginPage;
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  testUser: User;
};

export const test = base.extend<TestOptions>({
  testUser: [
    {
      email: 'spree@example.com',
      password: 'spree123',
    },
    { option: true },
  ],
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  // TODO: add a fixture for wishlist and other user account sections
});

export { expect } from '@playwright/test';

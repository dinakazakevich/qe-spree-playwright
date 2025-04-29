import { test as base } from '@playwright/test';
import { HomePage } from '../../pom/pages/homePage';
import { LoginPage } from '../../pom/pages/loginPage';
import { ProductsPage } from '../../pom/pages/productsPage';
import { ProductDetailsPage } from '../../pom/pages/productsDetailsPage';
import { User } from '../types/user';

export type TestOptions = {
  loginPage: LoginPage;
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  testUser: User;
};

export const test = base.extend<TestOptions>({
  loginPage: async ({ page, testUser }, use) => {
    await use(new LoginPage(page, testUser));
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

import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { ProductDetailsPage } from '../pages/productsDetailsPage';
// import { User } from '../types/types';
import { UserClient } from '../apiClient/userClient';

export type TestOptions = {
  loginPage: LoginPage;
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  userClient: UserClient;
  cartClient: CartClient;
  // testUser: User;
};

export const test = base.extend<TestOptions>({
  // testUser: [
  //   {
  //     email: 'spree@example.com',
  //     password: 'spree123',
  //   },
  //   { option: true },
  // ],
  // Instantiate page object and return a page that is ready to be used in the test
  // This allows to skip `let homepage = new HomePage`
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
  // Instantiate API client object to avoid having to add `let userClient = new UserClient` in every test
  userClient: async ({ request }, use) => {
    const client = new UserClient(request);
    await use(client);
  },
  // cartClient: async ({ request }, use) => {
  //   const client = new UserClient(request);
  //   await use(client);
  // },
});

export { expect } from '@playwright/test';

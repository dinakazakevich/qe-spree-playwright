import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { ProductDetailsPage } from '../pages/productsDetailsPage';
import { UserClient } from '../apiClient/userClient';

export type TestOptions = {
  loginPage: LoginPage;
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  userClient: UserClient;
};

export const test = base.extend<TestOptions>({
  // Instantiate page objects
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
  // Instantiate API client object
  userClient: async ({ request }, use) => {
    const client = new UserClient(request);
    await use(client);
  },
});

export { expect } from '@playwright/test';

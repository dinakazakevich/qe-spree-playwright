import { test as base, expect } from './instantiate';
import { LoginPage } from '../pages/loginPage';
import { User } from '../types/types';
import { UserClient } from '../apiClient/userClient';
import { getCookies } from '../datafactory/auth';

type AuthenticatedFixtures = {
  authenticatedPage: LoginPage;
  newAccountAuthenticatedPage: LoginPage;
  userParams?: Partial<User>; // Optional override
  testUser: User;
  userClient: UserClient;
  authenticatedUserClient: UserClient;
  authenticateWithCSRF: UserClient;
};

export const test = base.extend<AuthenticatedFixtures>({
  userParams: [undefined, { option: true }],

  testUser: async ({ userParams, userClient }, use) => {
    const defaultUser = { email: 'default@example.com', password: 'spree123' };
    const mergedUser = { ...defaultUser, ...userParams };
    const userCheck = await userClient.checkUserExists(mergedUser);
    if (userCheck) {
      await use(mergedUser);
    } else {
      await userClient.createAccount(mergedUser);
      await use(mergedUser);
    }
  },
  authenticatedPage: async ({ loginPage, testUser, userClient }, use) => {
    const userCheck = await userClient.checkUserExists(testUser);

    if (userCheck) {
      await loginPage.goto();
      await loginPage.loginForm.doLogin(testUser);

      // Confirm login is successful
      await loginPage.loginSuccess();

      // Pass the authenticated page object back to the test
      await use(loginPage);
    } else {
      // Go to Login page
      await loginPage.goto();

      // Choose to switch to Sign-up Form
      await loginPage.loginForm.signupLink.click();

      // Sign up with the new testUser credentials
      await loginPage.signupForm.signUp(testUser);

      // Confirm login is successful
      await loginPage.signupSuccess();
      expect(getCookies(loginPage.page.context(), '_spree_starter_session')).toBeTruthy();

      // Pass the authenticated page object back to the test
      await use(loginPage);
    }
  },
  authenticatedUserClient: async ({ userClient, testUser }, use) => {
    const userCheck = await userClient.checkUserExists(testUser);
    if (!userCheck) {
      await userClient.createAccount(testUser);
      // eslint-disable-next-line quotes, no-console
      console.log("Warning: user doesn't exist, creating a new user");
    }
    await userClient.authenticate(testUser);
    await use(userClient);
  },
});

export { expect } from '@playwright/test';

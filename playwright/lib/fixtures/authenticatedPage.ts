import { test as base, expect } from './instanciatedPage';
import { getCookies } from '../datafactory/auth';
import { generateUser } from '../datafactory/testData';
import { LoginPage } from '../pages/loginPage';
import { User } from '../types/types';

type AuthenticatedPages = {
  authenticatedPage: LoginPage;
  newAccountAuthenticatedPage: LoginPage;
  testUser: User;
};

export const test = base.extend<AuthenticatedPages>({
  authenticatedPage: async ({ loginPage, testUser }, use) => {
    // Perform login steps
    await loginPage.goto();
    await loginPage.loginForm.doLogin(testUser);

    // Confirm login is successful
    await loginPage.loginSuccess();

    // Pass the authenticated page object back to the test
    await use(loginPage);
  },
  newAccountAuthenticatedPage: async ({ loginPage }, use) => {
    const newTestUser = generateUser();
    // Go to Login page
    await loginPage.goto();

    // Choose to switch to Sign-up Form
    await loginPage.loginForm.signupLink.click();

    // Sign up with the new testUser credentials
    await loginPage.signupForm.signUp(newTestUser);

    // Confirm login is successful
    await loginPage.signupSuccess();
    expect(getCookies(loginPage.page.context(), '_spree_starter_session')).toBeTruthy();

    // Pass the authenticated page object back to the test
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';

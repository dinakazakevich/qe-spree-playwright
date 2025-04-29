import { test as base, expect } from './testOptions';
import { getCookies } from '../utils/authUtils';
import { generateUser } from '../utils/testData';
import { LoginPage } from '../../pom/pages/loginPage';
import { User } from '../types/user';

type AuthenticatedPages = {
  authenticatedPage: LoginPage;
  newAccountAuthenticatedPage: LoginPage;
  testUser: User;
};

export const test = base.extend<AuthenticatedPages>({
  authenticatedPage: async ({ loginPage, context, testUser }, use) => {
    // Perform login steps
    await loginPage.goto();
    await loginPage.loginForm.doLogin(testUser);

    // Confirm login is successful
    await loginPage.loginSuccess();
    expect(getCookies(context, '_spree_starter_session')).toBeTruthy();

    // Pass the authenticated page object back to the test
    await use(loginPage);
  },
  newAccountAuthenticatedPage: async ({ loginPage, context }, use) => {
    const newTestUser = generateUser();
    // Go to Login page
    await loginPage.goto();

    // Choose to switch to Sign-up Form
    await loginPage.loginForm.signupLink.click();

    // Sign up with the new testUser credentials
    await loginPage.SignupForm.signUp(newTestUser);

    // Confirm login is successful
    await loginPage.signUpSuccess();
    expect(getCookies(context, '_spree_starter_session')).toBeTruthy();

    // Pass the authenticated page object back to the test
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';

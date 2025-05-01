import { test as setup, expect } from '../lib/fixtures/authenticate';
import { getCookies } from '../lib/datafactory/auth';
import { generateUser } from '../lib/datafactory/testData';

const adminFile = 'playwright/.auth/admin.json';

setup.describe('authenticate as admin', () => {
  setup.use({
    testUser: {
      email: 'spree@example.com',
      password: 'spree123',
    },
  });
  setup('authenticate as admin, persist session storage', async ({ loginPage, testUser }) => {
    await loginPage.goto();
    await loginPage.loginForm.doLogin(testUser);
    await loginPage.loginSuccess();
    expect(getCookies(loginPage.page.context(), '_spree_starter_session')).toBeTruthy();
    await loginPage.page.context().storageState({ path: adminFile });
  });
});
setup.describe('authenticate as new user, persist session storage', () => {
  setup.use({ testUser: generateUser() });
  setup('authenticate as new user', async ({ loginPage, testUser }) => {
    const testUserFile = `playwright/.auth/${testUser.email}.json`;
    await loginPage.goto();
    await loginPage.signupForm.signUp(testUser);
    expect(getCookies(loginPage.page.context(), '_spree_starter_session')).toBeTruthy();
    await loginPage.page.context().storageState({ path: testUserFile });
  });
});

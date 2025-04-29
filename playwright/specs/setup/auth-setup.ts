import { test as setup, expect } from '../../lib/fixtures/testOptions';
import { getCookies } from '../../lib/utils/authUtils';
import { generateUser } from '../../lib/utils/testData';
import { User } from '../../lib/types/user';

const adminFile = '.auth/admin.json';
const testUserFile = '.auth/user.json';

setup('authenticate as admin', async ({ loginPage, context }) => {
  const adminUser: User = {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.PASSWORD!,
  };
  await loginPage.goto();
  await loginPage.navBar.navToAccount();
  await loginPage.loginForm.doLogin(adminUser);

  await loginPage.loginSuccess();
  expect(getCookies(context, '_spree_starter_session')).toBeTruthy();

  await loginPage.page.context().storageState({ path: adminFile });
});

setup('authenticate as user', async ({ loginPage, context }) => {
  const testUser: User = generateUser();
  await loginPage.goto();
  await loginPage.navBar.navToAccount();
  await loginPage.loginForm.signupLink.click();
  await loginPage.SignupForm.signUp(testUser);

  await loginPage.loginSuccess();
  expect(getCookies(context, '_spree_starter_session')).toBeTruthy();

  await loginPage.page.context().storageState({ path: testUserFile });
});

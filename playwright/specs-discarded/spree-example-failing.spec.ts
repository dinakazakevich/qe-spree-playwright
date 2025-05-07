import { test, expect } from '../lib/fixtures/instantiate';
import { generateUser } from '../lib/datafactory/testData';
import { LoginPage } from '../lib/pages/loginPage';
import { messages } from '../lib/datafactory/constants';

test('has title', async ({ homePage }) => {
  await homePage.goto();
  const user = generateUser();
  await homePage.navBar.navToAccount();
  await homePage.loginForm.signupLink.click();
  await homePage.signupForm.signup(user);
  await homePage.signupSuccess();

  await expect(homePage.page.getByText(messages.signup.success)).toBeVisible();
});

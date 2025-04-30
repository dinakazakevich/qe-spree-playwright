import { test, expect } from '../../lib/fixtures/instanciatedPage';
import { generateUser } from '../../lib/datafactory/testData';
import { LoginPage } from '../../lib/pages/loginPage';
import messages from '../../lib/datafactory/messages';

test('has title', async ({ homePage }) => {
  await homePage.goto();
  const user = generateUser();
  await homePage.navBar.navToAccount();
  await homePage.loginForm.signupLink.click();
  await homePage.signupForm.signUp(user);
  await homePage.signupSuccess();

  await expect(homePage.page.getByText(messages.signup.success)).toBeVisible();
});

import { test, expect } from '../lib/fixtures/authenticate';
import { generateUser } from '../lib/datafactory/testData';

test.use({ userParams: generateUser() });
test('admin user can see newly placed orders in the admin dashboard', async ({
  loginPage,
  homePage,
  authenticatedUserClient,
}) => {
  // Authentication is handled by the authenticate.ts fixture, can also be changed to pick up from .auth directory

  // Authenticate as a newly registered user, place and order, complete checkout
  const completeCheckoutJson = await authenticatedUserClient.placeOrder();

  // Note the cart details
  const orderNumber = completeCheckoutJson.data.attributes.number;

  // Authenticate with admin account
  const adminUser = {
    email: 'spree@example.com',
    password: 'spree123',
  };

  await loginPage.goto();

  await loginPage.loginForm.doLogin(adminUser);

  // With the admin account authenticated, go to the admin panel
  await loginPage.page.goto('/admin');

  // Click the Orders tab in the side bar
  await homePage.page.locator('#main-sidebar').getByRole('link', { name: 'Orders' }).click();

  // Assert the first table row contains the number of the order user above placed and it is of 'paid' state
  const firstTableRow = homePage.page.getByRole('row', { name: orderNumber})
  await expect(firstTableRow).toContainText('Paid');
});

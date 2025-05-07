// Discarded experiment of merging api checkout test + mocking the last checkout step.
import { test, expect } from '../lib/fixtures/authenticate';
import { generateUser } from '../lib/datafactory/testData';
import { successResponse } from '../lib/datafactory/mockCheckoutConfirmation';

test.describe('Checkout flow:', () => {
  const testUser = generateUser();

  test.use({ userParams: testUser });
  // Authentication is done via the authenticate.ts fixture
  test('entire checkout flow with API, mock the ', async ({ authenticatedUserClient, loginPage, checkoutPage }) => {
    await authenticatedUserClient.createCart();

    const cart = await authenticatedUserClient.retrieveCart();
    const cartToken = cart.data.attributes.token;

    // Add a random product in a random quality of 1-10 to cart
    await authenticatedUserClient.addProductToCart();

    // Add another random product in a random quality of 1-10 to cart
    await authenticatedUserClient.addProductToCart();

    // Add customer details: billing and shipping address
    await authenticatedUserClient.addAddresses();

    // Select shipping method and rate details
    await authenticatedUserClient.addShippingMethod();

    // Add payment details
    await authenticatedUserClient.addPaymentDetails(true); // Use valid card details

    console.log('cartToken', cartToken);

    await loginPage.goto();

    // const context = checkoutPage.page.context();

    // await context.route('**/confirm', async (route, request) => {
    //   if (request.method() === 'POST') {
    //   console.log('Intercepted POST request:', request.url());
    //   console.log('Post data:', request.postData());

    //   await route.fulfill({
    //     status: 200,
    //     contentType: 'text/html',
    //     body: successResponse,
    //   });
    //   } else {
    //     console.log('⛔ Skipped:', request.method(), request.url());
    //     await route.continue();
    //   }
    // });

    await checkoutPage.page.route('**/checkout/**/payment', async (route, request) => {
      // if (request.method() === 'GET') {
      console.log('Intercepted GET request:', request.url());
      console.log('Post data:', request.postData());

      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: successResponse,
      });
      //   } else {
      //     console.log('⛔ Skipped:', request.method(), request.url());
      //     await route.continue();
      //   }
    });

    await checkoutPage.page.waitForTimeout(3000);
    await loginPage.loginForm.doLogin(testUser);

    await checkoutPage.page.goto(`http://localhost:3000/checkout/${cartToken}/address`);

    await checkoutPage.saveAndContinue();
    await checkoutPage.saveAndContinue();
    // Submit in payment details
    await checkoutPage.fillPaymentDetail();
    await checkoutPage.page.getByRole('button', { name: 'Pay' }).click();

    await checkoutPage.page.getByRole('textbox', { name: 'Card Number' }).focus();
    await checkoutPage.page.getByRole('textbox', { name: 'Card Number' }).fill('4111111111111111');

    await checkoutPage.page.getByRole('textbox', { name: 'Expiration Date' }).fill('122031');

    await checkoutPage.page.getByRole('textbox', { name: 'CVV' }).fill('111');

    await checkoutPage.page.getByRole('button', { name: 'Pay' }).click();

    await checkoutPage.page.getByRole('textbox', { name: 'Card Number' }).focus();
    await checkoutPage.page.getByRole('textbox', { name: 'Card Number' }).fill('4111111111111111');

    await checkoutPage.page.getByRole('textbox', { name: 'Expiration Date' }).fill('122031');

    await checkoutPage.page.getByRole('textbox', { name: 'CVV' }).fill('111');

    await checkoutPage.page.getByRole('button', { name: 'Pay' }).click();
    await checkoutPage.page.getByRole('button', { name: 'Pay' }).click();
    console.log(checkoutPage.page.url());

    await checkoutPage.page.getByRole('button', { name: 'Pay' }).click();

    checkoutPage.page.getByText('Thanks');

    // Assert that the mocked order confirmation page with 'Strawberry' client name loaded
    await expect(checkoutPage.page.getByText('Thanks Strawberry for your order!')).toBeVisible();

    // // Proceed with checkout
    // await authenticatedUserClient.completeCheckout();

    // // Retrieve all customer's orders
    // const response = await authenticatedUserClient.retrieveAllOrders();

    // // Assert that all customer's orders contain the latest order
    // let allOrders: number[] = [];
    // for (let i = 0; i < response.data.length; i++) {
    //   allOrders.push(response.data[i].id);
    // }
    // expect(allOrders).toContain(authenticatedUserClient.latestOrderId);
  });
});

import { test, expect } from '../lib/fixtures/instantiate';
import { CheckoutPage } from '../lib/pages/checkoutPage';
import { faker } from '@faker-js/faker';

// eslint-disable-next-line quotes
test("mocks a fruit and doesn't call api", async ({ homePage, productsPage, productDetailsPage, checkoutPage }) => {
  // Mock the api call before navigating

  await homePage.goto();
  await homePage.page.goto('http://localhost:3000/products');

  await homePage.page.route('*/**/checkout/**/update/payment', async (route) => {
    // const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!DOCTYPE html>
  <html>
    <head>
      <title>Mocked Checkout Page</title>
    </head>
    <body>
      <h1>Thanks Strawberry for your order!</h1>
    </body>
  </html>`,
    });
  });
  await productsPage.selectProduct('Checked Shirt');
  await productDetailsPage.selectSize('M');
  await productDetailsPage.addToCart();
  await productDetailsPage.cartSidebar.proceedToCheckout();
  await checkoutPage.fillEmail(faker.internet.email());
  await checkoutPage.fillShippingAddress();
  await checkoutPage.page.getByRole('button', { name: 'Save and Continue' }).click();
  await checkoutPage.acceptDefaultShipping();
  await checkoutPage.fillPaymentDetail();
  await checkoutPage.page.getByRole('button', { name: 'Pay' }).click();

  // Assert that the Strawberry fruit is visible
  await expect(homePage.page.getByText('Strawberry')).toBeVisible();

  await productDetailsPage.page.waitForTimeout(2000);

  //   // Go to the page

  // await checkoutPage.pay();
});

test('gets the json from api and adds a new fruit', async ({ page }) => {
  // Get the response and add to it
  await page.route('*/**/api/v1/fruits', async (route) => {
    console.log('Intercepting...');
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Loquat', id: 100 });
    // Fulfill using the original response, while patching the response body
    // with the given JSON object.
    await route.fulfill({ response, json });
  });

  // Go to the page
  await page.goto('https://demo.playwright.dev/api-mocking');

  // Assert that the new fruit is visible
  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
});

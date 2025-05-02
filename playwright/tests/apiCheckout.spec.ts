import { apiRoutes } from '../lib/datafactory/constants';
import { test, expect } from '../lib/fixtures/authenticate';
import { generateUser } from '../lib/datafactory/testData';

test.describe('Checkout flow:', () => {
  test.use({
    userParams: {
      email: 'spree@example.com',
      password: 'spree123',
    },
  });
  test('entire checkout flow with api', async ({ authenticatedUserClient }) => {
    console.log('authenticatedUserClient.tokenData', authenticatedUserClient.tokenData);
    const response = await authenticatedUserClient.get(apiRoutes.storefront.wishlist, {
      headers: {
        Authorization: `Bearer ${authenticatedUserClient.tokenData}`,
      },
    });
    const responsejson = await response.json();
    console.log('responsejson:', responsejson);
    // Create a new cart
    // Add a product variant to cart
    // Proceed with checkout
    // Fill in address and card information\
    // Select shipping option
    // Place order
    // Confirm final checkout page, mock the UI
  });
});

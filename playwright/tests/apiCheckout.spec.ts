import { apiRoutes } from '../lib/datafactory/constants';
import { test, expect } from '../lib/fixtures/authenticate';
import { generateUser } from '../lib/datafactory/testData';

test.describe('Checkout flow:', () => {
  test.use({ userParams: generateUser() });
  test('entire checkout flow with api', async ({ authenticatedUserClient }) => {
    // Authentication is done via the authenticate.ts fixture

    // Testing that userClient has picked up the Authorization header from the class property
    const response = await authenticatedUserClient.get(apiRoutes.storefront.wishlist);
    // Create a new cart
    // Add a product variant to cart
    // Proceed with checkout
    // Fill in address and card information\
    // Select shipping option
    // Place order
    // Confirm final checkout page, mock the UI
  });
});

import { test, expect } from '../lib/fixtures/authenticate';
import { CART_STORAGE } from '../lib/datafactory/constants';
import { CartComponent } from '../lib/components/cartComponent';
import { generateUser } from '../lib/datafactory/testData';

test.use({ testUser: generateUser() });
test('abandoned cart scenario', async ({ browser, page, productsPage, productDetailsPage }) => {
  // Go to products page
  await page.goto('/products');

  await productsPage.selectProduct();

  await productDetailsPage.selectSize('M');

  await productDetailsPage.addToCart();

  await expect(productsPage.cartSidebar.cartListItem).toBeVisible();

  await productDetailsPage.cartSidebar.assertNotEmpty();

  const browser1 = productDetailsPage.page.context();
  await browser1.storageState({ path: CART_STORAGE });
  await browser1.close();

  // Reopen the browser, load the context and open new page
  const reopenedBrowser = await browser.newContext({ storageState: CART_STORAGE });
  const page2 = await reopenedBrowser.newPage();

  // Go to homepage and open the cart sidebar
  await page2.goto('/');
  await page2.getByRole('link', { name: 'Cart' }).click();

  // // Make sure it is not empty
  const cartSidebar = new CartComponent(page2.locator('#slideover-cart'));
  await expect(cartSidebar.cartListItem).toBeVisible();
  expect(cartSidebar.assertNotEmpty()).toBeTruthy();
});

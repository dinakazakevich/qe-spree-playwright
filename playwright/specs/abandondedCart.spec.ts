import { test, expect } from '../lib/fixtures/authenticate';
import { CART_STORAGE } from '../lib/datafactory/constants';
import { CartComponent } from '../lib/components/cartComponent';
import { generateUser } from '../lib/datafactory/testData';

test.use({ testUser: generateUser() });
test('abandoned cart scenario', async ({ browser, productsPage, productDetailsPage }) => {
  // Go to products page
  await productsPage.goto();
  await productsPage.selectProduct();
  await productDetailsPage.selectSize('M');
  await productDetailsPage.addToCart();
  await productDetailsPage.cartSidebar.assertNotEmpty();
  const browser1 = productDetailsPage.page.context();
  await browser1.storageState({ path: CART_STORAGE });
  await browser1.close();
  const reopenedBrowser = await browser.newContext({ storageState: CART_STORAGE });
  const page2 = await reopenedBrowser.newPage();
  await page2.goto('/');
  await page2.getByRole('link', { name: 'Cart' }).click();
  const reopenedCartSidebar = new CartComponent(page2.locator('#slideover-cart'));
  expect(reopenedCartSidebar.assertNotEmpty()).toBeTruthy();
  await reopenedBrowser.close();
});

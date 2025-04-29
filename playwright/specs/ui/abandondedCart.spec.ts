import { test } from '../../fixtures/authenticatedTest';
import { ProductPage } from '../../pom/pages/productsPage';
import { ProductDetailsPage } from '../../pom/pages/productsDetailsPage';

test('abandoned cart scenario', async ({ adminAuthenticatedPage }) => {
  let productsPageAuth = new ProductPage(adminAuthenticatedPage);
  let productDetailsPageAuth = new ProductDetailsPage(adminAuthenticatedPage);

  // Go to homepage and make sure you are logged-in

  await productsPageAuth.goto();
  await productsPageAuth.selectProduct();
  await productDetailsPageAuth.selectSize('M');
  await productDetailsPageAuth.addToCart();
  await productDetailsPageAuth.cartSidebar.assertNotEmpty();

  //
});

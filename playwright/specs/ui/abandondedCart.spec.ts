import { test } from '../../lib/fixtures/authenticatedPage';
import { ProductsPage } from '../../lib/pages/productsPage';
import { ProductDetailsPage } from '../../lib/pages/productsDetailsPage';

test('abandoned cart scenario', async ({ authenticatedPage }) => {
  let productsPageAuth = new ProductsPage(ProductsPage);
  let productDetailsPageAuth = new ProductDetailsPage(ProductDetailsPage);

  // Go to homepage and make sure you are logged-in

  await productsPageAuth.goto();
  await productsPageAuth.selectProduct();
  await productDetailsPageAuth.selectSize('M');
  await productDetailsPageAuth.addToCart();
  await productDetailsPageAuth.cartSidebar.assertNotEmpty();

  //
});

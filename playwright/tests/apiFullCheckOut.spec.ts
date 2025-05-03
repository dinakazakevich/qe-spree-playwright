import { apiRoutes } from '../lib/datafactory/constants';
import { test, expect } from '../lib/fixtures/instantiate';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import { generateUser } from '../lib/datafactory/testData';

const testUser = generateUser();
test('a full checkout flow via API', async ({ userClient }) => {
  // const testUser = {
  //   email: 'spree@example.com',
  //   password: 'spree123',
  // };
  // Step 1: Get the login page to extract CSRF token
  const loginPageResponse = await userClient.get('/users/sign_in');
  console.log('step1:', 'loaded login page');
  const loginPageHTML = await loginPageResponse.text();
  console.log('step2:', 'got the login page html');
  fs.writeFileSync('playwright/login_page.html', await loginPageResponse.text());

  // Extract CSRF token from meta tag
  // const csrfMatch = loginPageHTML.match(/<meta name="csrf-token" content="([^"]+)"/);
  // const csrfToken = csrfMatch ? csrfMatch[1] : null;
  // console.log('step3:', 'found token');
  // console.log(csrfToken);

  // if (!csrfToken) {
  //   throw new Error('CSRF token not found');
  // }
  const dom = new JSDOM(loginPageHTML);
  const document = dom.window.document;

  // Find the form by ID
  const form = document.querySelector('form#new_user');
  if (!form) {
    throw new Error('Login form not found');
  }
  console.log('form', form);

  // Find the hidden input with name="authenticity_token"
  const tokenInput = form.querySelector('input[name="authenticity_token"]');
  // console.log('tokenInput', tokenInput);
  console.log('tokenInput_value', tokenInput?.getAttribute('value'));
  const csrfToken = tokenInput ? tokenInput.getAttribute('value') : null;

  console.log('step3:', 'found token');
  console.log(csrfToken);

  if (!csrfToken) {
    throw new Error('CSRF token not found in login form');
  }

  // Submit login form with the CSRF token
  console.log('step4:', 'sending request');
  const response = await userClient.post('/users/sign_in', {
    form: {
      authenticity_token: csrfToken,
      'spree_user[email]': testUser.email,
      'spree_user[password]': testUser.password,
      'user[remember_me]': 0,
      commit: 'Login',
    },
  });
  console.log('step5:', 'request sent');
  console.log('Login status:', response.status());
  fs.writeFileSync('playwright/sign_in.html', await response.text());

  const getShirtToken = await userClient.get('/products/regular-shirt?options=1%3Ablue%2C2%3Am');
  const shirtHTML = await getShirtToken.text();

  const shirtDOM = new JSDOM(shirtHTML);
  const shirtDocument = shirtDOM.window.document;

  // Add item to cart
  // Find the hidden input with name="authenticity_token"
  const lineItemForm = shirtDocument.querySelector('form[action="/line_items"]');
  const lineItemInput = lineItemForm?.querySelector('input[name="authenticity_token"]');
  console.log('lineItemInput:', lineItemInput);
  // console.log('tokenInput', tokenInput);
  console.log('lineItemInput_value', lineItemInput?.getAttribute('value'));
  const lineItemToken = lineItemInput ? lineItemInput.getAttribute('value') : null;

  console.log('step6:', 'found token');
  console.log(lineItemToken);

  const addItemResponse = await userClient.post(apiRoutes.client.addItemToCart, {
    form: {
      authenticity_token: lineItemToken,
      Color: 'blue',
      Size: 'm',
      quantity: 1,
      variant_id: 169,
    },
  });

  console.log('addItemResponse:', addItemResponse.status());
  // expect(addItemResponse.status()).toBe(200);

  // Get the wishlist page
  // const responseWishlist = await userClient.get(apiRoutes.client.wishlist);
  // const wishlistHTML = await responseWishlist.text(); // Fixed: moved this line up

  // console.log('test_html1');
  // fs.writeFileSync('playwright/wishlistHTML.html', wishlistHTML);
  // console.log('test_html2');

  // Create DOM from wishlist HTML
  // const dom = new JSDOM(wishlistHTML);
  // const document = dom.window.document;

  // Check for product in wishlist
  // const productName = 'Checked Shirt';
  // const productElementsByName = Array.from(document.querySelectorAll('.product-name')).filter((el) =>
  //   el.textContent?.includes(productName)
  // );

  // // Fixed: boolean comparison
  // const productExists = productElementsByName.length > 0;
  // expect(productExists).toBeTruthy();
});

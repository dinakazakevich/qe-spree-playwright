import { apiRoutes, cardNumbers } from '../lib/datafactory/constants';
import { test, expect } from '../lib/fixtures/authenticate';
import { generateUser } from '../lib/datafactory/testData';
import { mathRandom } from '../lib/helpers/utils';
import { fakerEN_US as faker } from '@faker-js/faker';



test.describe('Checkout flow:', () => {
  const testUser = generateUser();
  test.use({ userParams: testUser });
  // Authentication is done via the authenticate.ts fixture
  test('entire checkout flow with API', async ({ authenticatedUserClient }) => {
    // DONE: Authenticate and manage user sessions with API requests.

    // Create a new cart parse it and set the cart token
    const userCart = await authenticatedUserClient.post(apiRoutes.storefront.createCart);
    const userCartJson = await userCart.json();
    const cartToken = userCartJson.data.attributes.token;
    authenticatedUserClient.cartToken = userCartJson.data.attributes.token;

    // Add a product variant to cart
    const getProduct = await authenticatedUserClient.get(apiRoutes.storefront.products + '/' + mathRandom(1, 25));
    const getProductJson = await getProduct.json();
    const default_variant = getProductJson.data.relationships.default_variant.data.id;

    const product = {
      variant_id: default_variant,
      quantity: mathRandom(1, 5),
    };

    await authenticatedUserClient.post(apiRoutes.storefront.addToCart, {
      headers: { 'X-Spree-Order-Token': cartToken },
      data: product,
    });
    // const addToCartJson = await addToCart.json();
    // expect(addToCartJson).toContain(default_variant);
    // console.log('getCart', await getCart.json());

    // Proceed to checkout
    await authenticatedUserClient.patch(apiRoutes.storefront.checkoutNext, {
      headers: { 'X-Spree-Order-Token': cartToken },
    });

    const customerDetails = {
      order: {
        email: testUser.email,
        bill_address_attributes: {
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          address1: faker.location.streetAddress(),
          city: faker.location.city(),
          country_iso3: faker.location.countryCode('alpha-3'),
          address2: faker.location.secondaryAddress(),
          phone: faker.phone.number(),
          zipcode: '91234',
          state_name: faker.location.state(),
          company: faker.company.name(),
          state_code: faker.location.state({ abbreviated: true }),
          country_iso: 'US',
        },
        ship_address_attributes: {
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          address1: faker.location.streetAddress(),
          city: faker.location.city(),
          country_iso: 'US',
          address2: faker.location.secondaryAddress(),
          phone: faker.phone.number(),
          zipcode: faker.location.zipCode(),
          state_name: faker.location.state({ abbreviated: true }),
          company: faker.company.name(),
          label: faker.word.adjective(100),
        },
      },
    };

    // Add customer details: billing and shipping address
    await authenticatedUserClient.patch(apiRoutes.storefront.checkout, {
      headers: { 'X-Spree-Order-Token': cartToken },
      data: customerDetails,
    });
    // const checkoutCustomerDetailsJson = await checkoutCustomerDetails.json();
    // console.log('checkoutCustomerDetailsJson:', checkoutCustomerDetailsJson);
    // const checkoutCustomerDetailsShippingAddress = checkoutCustomerDetailsJson.data.relationships.shipping_address;
    // const checkoutCustomerDetailsBillingAddress = checkoutCustomerDetailsJson.data.relationships.billing_address;
    // console.log('checkoutCustomerDetails:', await checkoutCustomerDetails.json());
    // console.log('checkoutCustomerDetailsBillingAddress:', checkoutCustomerDetailsShippingAddress);
    // console.log('checkoutCustomerDetailsBillingAddress:', checkoutCustomerDetailsBillingAddress);

    // Retrieve information about available shipping options and build out a shipping details object
    const shippingRates = await authenticatedUserClient.get(apiRoutes.storefront.shippingRates);
    const shippingRatesJson = await shippingRates.json();
    const shippingId = shippingRatesJson.data[0].id;
    const shippingRateId = shippingRatesJson.included[0].id;
    const shippingMethod = shippingRatesJson.included[0].attributes.shipping_method_id;

    const shippingRatesDetails = {
      order: {
        shipments_attributes: [
          {
            id: shippingId,
            selected_shipping_rate_id: shippingRateId,
          },
        ],
      },
    };

    // Select shipping rates
    await authenticatedUserClient.patch(apiRoutes.storefront.checkout, {
      headers: { 'X-Spree-Order-Token': cartToken },
      data: shippingRates,
    });

    // Select shipping method
    const shippingData = { shipping_method_id: shippingId };

    await authenticatedUserClient.patch(apiRoutes.storefront.shippingMethod, {
      headers: { 'X-Spree-Order-Token': cartToken },
      data: shippingData,
    });

    // Add payment details

    const validPaymentDetails = {
      order: {
        payments_attributes: [
          {
            payment_method_id: 2,
            source_attributes: {
              number: cardNumbers.valid.visa[mathRandom(0, 2)],
              month: 10,
              year: 2031,
              cc_type: 'visa',
              verification_value: '123',
              name: 'Bogus Gateway',
            },
          },
        ],
      },
    };

    const invalidPaymentDetails = {
      order: {
        payments_attributes: [
          {
            payment_method_id: 2,
            source_attributes: {
              number: cardNumbers.invalid.visa[mathRandom(0, 1)],
              month: 10,
              year: 2031,
              cc_type: 'visa',
              verification_value: '123',
              name: 'Bogus Gateway',
            },
          },
        ],
      },
    };
    await authenticatedUserClient.patch(apiRoutes.storefront.checkout, {
      data: validPaymentDetails,
      headers: { 'X-Spree-Order-Token': cartToken },
    });

    // // Place order
    // await authenticatedUserClient.patch(apiRoutes.storefront.checkoutNext, {
    //   headers: { 'X-Spree-Order-Token': cartToken },
    // });

    // const validate = await authenticatedUserClient.post(apiRoutes.storefront.validate);
    // const validateJson = await validate.json();
    // console.log('validate:', await validate.json());

    // const orderDetails = {
    //   line_items: validateJson.data.relationships.line_items.data,
    //   variants: validateJson.data.relationships.variants.data,
    //   promotions: validateJson.data.relationships.promotions.data,
    //   payments: validateJson.data.relationships.payments.data,
    //   shipments: validateJson.data.relationships.shipments.data,
    //   user: validateJson.data.relationships.user.data,
    //   billing_address: validateJson.data.relationships.billing_address,
    //   shipping_address: validateJson.data.relationships.shipping_address,
    // };
    // console.log('orderdetails:', orderDetails);
    // console.log('payments:', orderDetails.payments);

    // Proceed with checkout
    const completeCheckout = await authenticatedUserClient.patch(apiRoutes.storefront.checkoutComplete, {
      headers: { 'X-Spree-Order-Token': cartToken },
    });
    const completeCheckoutJson = await completeCheckout.json();
    console.log('completeCheckout', completeCheckoutJson);

    // Mock payment processing and handle responses.

    // Validate order completion and ensure correct data persistence.
    // Consider failure scenarios like payment declines or invalid orders
  });
});

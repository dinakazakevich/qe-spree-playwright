import { apiRoutes } from '../lib/datafactory/constants';
import { test, expect } from '../lib/fixtures/authenticate';
import { generateUser } from '../lib/datafactory/testData';
import { mathRandom } from '../lib/helpers/utils';
import { faker } from '@faker-js/faker';

test.describe('Checkout flow:', () => {
  const testUser = generateUser();
  test.use({ userParams: testUser });
  test('entire checkout flow with API', async ({ authenticatedUserClient }) => {
    // Authentication is done via the authenticate.ts fixture

    // DONE: Authenticate and manage user sessions with API requests.

    // Testing that userClient has picked up the Authorization header from the class property
    const response = await authenticatedUserClient.get(apiRoutes.storefront.wishlist);

    // Create a new cart
    const userCart = await authenticatedUserClient.post(apiRoutes.storefront.createCart);
    const userCartJson = await userCart.json();

    const orderToken = userCartJson.data.attributes.token;

    // Add a product variant to cart
    const getAllProducts = await authenticatedUserClient.get(apiRoutes.storefront.products);

    const getProduct = await authenticatedUserClient.get(apiRoutes.storefront.products + '/' + mathRandom(1, 25));
    const getProductJson = await getProduct.json();
    // console.log('variants:', getProductJson.data.relationships.variants);
    const default_variant = getProductJson.data.relationships.default_variant.data.id;
    // console.log('default_variant:', default_variant);
    const primary_variant = getProductJson.data.relationships.primary_variant.data.id;
    // console.log('primary_variant:', primary_variant);

    const product = {
      variant_id: default_variant,
      quantity: mathRandom(1, 5),
    };

    const addToCart = await authenticatedUserClient.post(apiRoutes.storefront.addToCart, {
      headers: { 'X-Spree-Order-Token': orderToken },
      data: product,
    });
    const addToCartJson = await addToCart.json();
    // expect(addToCartJson).toContain(default_variant);
    // console.log('getCart', await getCart.json());

    const customerDetails = {
      order: {
        email: testUser.email,
        bill_address_attributes: {
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          address1: faker.location.streetAddress(),
          city: faker.location.city(),
          phone: faker.phone.number(),
          zipcode: faker.location.zipCode(),
          state_name: faker.location.state({ abbreviated: true }),
          country_iso: 'US',
        },
        ship_address_attributes: {
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          address1: faker.location.streetAddress(),
          city: faker.location.city(),
          phone: faker.phone.number(),
          zipcode: faker.location.zipCode(),
          state_name: faker.location.state({ abbreviated: true }),
          country_iso: 'US',
        },
      },
    };
    console.log('customerDetails:', customerDetails);

    // Add customer details: billing and shipping address
    const checkoutCustomerDetails = await authenticatedUserClient.patch(apiRoutes.storefront.checkout, {
      headers: { 'X-Spree-Order-Token': orderToken },
      data: customerDetails,
    });

    // const checkoutCustomerDetailsJson = await checkoutCustomerDetails.json();
    // console.log('checkoutCustomerDetailsJson:', checkoutCustomerDetailsJson);
    // const checkoutCustomerDetailsShippingAddress = checkoutCustomerDetailsJson.data.relationships.shipping_address;
    // const checkoutCustomerDetailsBillingAddress = checkoutCustomerDetailsJson.data.relationships.billing_address;
    // console.log('checkoutCustomerDetails:', await checkoutCustomerDetails.json());
    // console.log('checkoutCustomerDetailsBillingAddress:', checkoutCustomerDetailsShippingAddress);
    // console.log('checkoutCustomerDetailsBillingAddress:', checkoutCustomerDetailsBillingAddress);

    const advanceOrder = await authenticatedUserClient.patch(apiRoutes.storefront.checkoutAdvance, {
      headers: { 'X-Spree-Order-Token': orderToken },
    });

    const shippinRates = await authenticatedUserClient.get(apiRoutes.storefront.shippingRates);
    const shippinRatesJson = await shippinRates.json();
    const shippingId = shippinRatesJson.data[0].id;
    const shippingRateId = shippinRatesJson.included[0].id;

    const shippingRates = {
      order: {
        shipments_attributes: [
          {
            id: shippingId,
            selected_shipping_rate_id: shippingRateId,
          },
        ],
      },
    };

    const shippingData = { shipping_method_id: shippingId };

    // console.log('shippingOptions:', await shippingOptions.json());

    const checkoutShipping = await authenticatedUserClient.patch(apiRoutes.storefront.checkout, {
      headers: { 'X-Spree-Order-Token': orderToken },
      data: shippingRates,
    });
    // console.log('checkoutShipping:', await checkoutShipping.json());

    const getAllPaymentMethods = await authenticatedUserClient.get(apiRoutes.storefront.paymentMethods);
    const getAllPaymentMethodsJson = await getAllPaymentMethods.json();
    const getAllPaymentMethodsJsonDetails = getAllPaymentMethodsJson.data[0].attributes;
    console.log('getAllPaymentMethods:', await getAllPaymentMethods.json());
    console.log('getAllPaymentMethodsJsonDetails:', getAllPaymentMethodsJsonDetails);

    console.log('checkoutShipping:', await checkoutShipping.json());

    const paymentMethod = {
      payment_method_id: 2,
      source_attributes: {
        gateway_payment_profile_id: 'card_1JqvNB2eZvKYlo2C5OlqLV7S',
        cc_type: 'visa',
        last_digits: '9995',
        month: 10,
        year: 2026,
        name: 'John Snow',
      },
    };

    // const addNewPaymentMethod = await authenticatedUserClient.post(apiRoutes.storefront.createPayment, {
    //   data: paymentMethod,
    //   headers: { 'X-Spree-Order-Token': orderToken },
    // });
    // console.log('addNewPaymentMethod:', await addNewPaymentMethod.json());

    // Add payment details

    const paymentDetails = {
      order: {
        payments_attributes: [
          {
            payment_method_id: 2,
            source_attributes: {
              gateway_payment_profile_id: 'PUBLICKEY123',
              cc_type: 'visa',
              last_digits: '1111',
              month: 10,
              year: 2022,
              name: 'John Doe',
            },
          },
        ],
      },
    };

    const checkoutPayment = await authenticatedUserClient.patch(apiRoutes.storefront.checkout, {
      data: paymentDetails,
      headers: { 'X-Spree-Order-Token': orderToken },
    });

    // console.log('checkoutPayment:', await checkoutPayment.json());

    // const advanceOrder = await authenticatedUserClient.patch(apiRoutes.storefront.checkoutAdvance, {
    //   headers: { 'X-Spree-Order-Token': orderToken },
    // });
    // console.log('advanceOrder:', await advanceOrder.json());

    await authenticatedUserClient.patch(apiRoutes.storefront.checkoutNext, {
      headers: { 'X-Spree-Order-Token': orderToken },
    });

    await authenticatedUserClient.patch(apiRoutes.storefront.checkoutAdvance, {
      headers: { 'X-Spree-Order-Token': orderToken },
    });

    const validate = await authenticatedUserClient.post(apiRoutes.storefront.validate);
    const validateJson = await validate.json();
    console.log('validate:', await validate.json());

    const orderDetails = {
      line_items: validateJson.data.relationships.line_items.data,
      variants: validateJson.data.relationships.variants.data,
      promotions: validateJson.data.relationships.promotions.data,
      payments: validateJson.data.relationships.payments.data,
      shipments: validateJson.data.relationships.shipments.data,
      user: validateJson.data.relationships.user.data,
      billing_address: validateJson.data.relationships.billing_address,
      shipping_address: validateJson.data.relationships.shipping_address,
    };
    console.log('orderdetails:', orderDetails);
    console.log('payments:', orderDetails.payments);

    // Proceed with checkout
    const completeCheckout = await authenticatedUserClient.patch(apiRoutes.storefront.checkoutComplete, {
      headers: { 'X-Spree-Order-Token': orderToken },
    });
    const completeCheckoutJson = await completeCheckout.json();
    console.log('completeCheckout', completeCheckoutJson);

    // Fill in address and card information

    // Select shipping option

    // Place order
    // Mock payment processing and handle responses.

    // Validate order completion and ensure correct data persistence.
    // Consider failure scenarios like payment declines or invalid orders
  });
});

import path from 'path';
import { User } from '../types/types';

// Define constants for paths
export const CART_STORAGE = path.resolve(__dirname, '../../.auth/cart-token.json');
export const ADMIN_SESSION_STORAGE = path.resolve(__dirname, '.auth/admin.json');
export const USER_SESSION_STORAGE = path.resolve(__dirname, '.auth/user.json');

export const defaultUser: User = {
  email: 'spree@example.com',
  password: 'spree123',
};

export const apiRoutes = {
  client: {
    login: '/users/sign_in',
    signout: '/users/sign_out',
    register: '/users',
    products: '/products',
    onSale: '/t/collections/on-sale',
    newArrivals: '/t/collections/new-arrivals',
    blog: '/posts',
    wishlist: '/account/wishlist',
    addItemToCart: '/line_items',
  },
  storefront: {
    createAccount: '/api/v2/storefront/account',
    retrieveAccount: '/api/v2/storefront/account',
    createCart: '/api/v2/storefront/cart',
    retrieveCart: '/api/v2/storefront/cart',
    authenticate: '/spree_oauth/token',
  },
  // Platform API used for accessing admin platform
  platform: {
    retrieveUser: '/', // TODO: add URL
    products: '',
    authenticate: '/spree_oauth/token',
  },
};

export const messages = {
  login: {
    success: 'Signed in successfully.',
    invalid: 'Invalid Email or password.',
  },

  signup: {
    success: 'Welcome! You have signed up successfully.',
  },
  signout: 'Signed out successfully',
};

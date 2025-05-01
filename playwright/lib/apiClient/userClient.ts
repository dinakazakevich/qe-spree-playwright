import { BaseApiClient } from './baseApiClient';
import { User } from '../types/types';
import { apiRoutes } from '../datafactory/constants';

export class UserClient extends BaseApiClient {
  async createAccount(testUser: User) {
    return await this.post(apiRoutes.storefront.createAccount, {
      data: {
        user: {
          email: testUser.email,
          password: testUser.password,
          password_confirmation: testUser.password,
        },
      },
    });
  }

  async authenticate(testUser: User) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', testUser.email);
    formData.append('password', testUser.password);

    // Make the POST request to /authenticate endpoint
    const response = await this.post(apiRoutes.storefront.authenticate, {
      headers: {
        'Set-Cookie': '',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }

  // Experimenting with API authentication
  async authenticateWithCSRF(testUser: User) {
    // Step 1: Get the login page to extract CSRF token
    const loginPageResponse = await this.get('/users/sign_in');
    // console.log('step1:', 'loaded login page');
    const loginPageHTML = await loginPageResponse.text();
    // console.log('step2:', 'got the login page html');

    // Extract CSRF token from meta tag
    const csrfMatch = loginPageHTML.match(/<meta name="csrf-token" content="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : null;
    // console.log('step3:', 'found token');

    if (!csrfToken) {
      throw new Error('CSRF token not found');
    }

    // Submit login form with the CSRF token
    // console.log('step4:', 'sending request');
    const response = await this.post('/users/sign_in', {
      form: {
        authenticity_token: csrfToken,
        'spree_user[email]': testUser.email,
        'spree_user[password]': testUser.password,
        'user[remember_me]': 0,
        commit: 'Login',
      },
    });
    // console.log('step5:', 'request sent');
    console.log('Login status:', response.status());
  }

  async checkUserExists(testUser: User) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', testUser.email);
    formData.append('password', testUser.password);

    // Make the POST request to /authenticate endpoint
    const response = await this.post(apiRoutes.storefront.authenticate, {
      headers: {
        'Set-Cookie': '',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });
    // const response = await this.authenticate(testUser);
    return response.status() === 200;
    // return response;
  }

  async getAccessToken(testUser: User) {
    const response = await this.authenticate(testUser);
    const json = await response.json();
    return json.access_token;
  }
}

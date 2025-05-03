import { BaseApiClient } from './baseApiClient';
import { User } from '../types/types';
import { apiRoutes } from '../datafactory/constants';

export class UserClient extends BaseApiClient {
  async createAccount(testUser: User) {
    // console.log('createUserTestUser:', testUser);
    const response = await this.post('/api/v2/storefront/account', {
      data: {
        user: {
          email: testUser.email,
          password: testUser.password,
          password_confirmation: testUser.password,
        },
      },
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    });
    return response;
  }

  async authenticate(testUser: User) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', testUser.email);
    formData.append('password', testUser.password);

    // Make the POST request to /authenticate endpoint
    const response = await this.post(apiRoutes.storefront.authenticate, {
      data: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  }

  async checkUserExists(testUser: User) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', testUser.email);
    formData.append('password', testUser.password);
    const response = await this.post(apiRoutes.storefront.authenticate, {
      data: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.status() === 200;
  }

  async getAccessToken(testUser: User) {
    const response = await this.authenticate(testUser);
    const json = await response.json();
    return json.access_token;
  }
}

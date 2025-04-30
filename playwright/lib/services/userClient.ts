import { APIRequestContext } from '@playwright/test';

export class UserClient {
  constructor(private request: APIRequestContext) {}

  async createUser(payload: UserPayload) {
    return await this.request.post('/users', { data: payload });
  }

  async getUser(id: string) {
    return await this.request.get(`/users/${id}`);
  }
}

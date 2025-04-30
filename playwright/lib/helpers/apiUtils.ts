import { APIRequestContext } from '@playwright/test';

export function getUserClient(request: APIRequestContext) {
  return new UserClient(request);
}

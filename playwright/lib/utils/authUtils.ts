import { request, type BrowserContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Returns valid cookies for the given username and password.
 * If a username and password aren't provided a random email is generated and the default password will be used
 *
 * @example
 * import { createCookies } from "../api/auth";
 *
 * const cookies = createCookies("spree@example.com", "Pa$$word")
 *
 * const response = await request.put(`booking/${bookingId}`, {
 *  headers: { cookie: cookies },
 *  data: body,
 * });
 */

export async function createCookies(username?: string, password?: string) {
  // Use provided credentials or defaults
  if (!username) {
    username = faker.internet.email();
  }
  if (!password) {
    password = 'spree123';
  }

  const url: string = process.env.baseURL! + '/spree_oauth/token';

  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', `${username}`);
  formData.append('password', `${password}`);

  // Create request context
  const requestContext = await request.newContext();

  // Make the POST request
  await requestContext.post(url, {
    headers: {
      'Set-Cookie': '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData.toString(),
  });
}

export async function getCookies(context: BrowserContext, name: string) {
  const cookies = await context.cookies();
  return cookies.find((cookie) => cookie.name === name);
}

export async function checkedLoggedIn(context: BrowserContext) {
  expect(getCookies(context, '_spree_starter_session')).toBeTruthy();
}

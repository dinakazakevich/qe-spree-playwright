import { request, type BrowserContext, expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { User } from '../types/types';

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

export async function createCookies(testUser: User) {
  // Use provided credentials or defaults
  if (!testUser.email) {
    testUser.email = 'spree@example.com';
  }
  if (!testUser.password) {
    testUser.password = 'spree123';
  }

  // const url: string = process.env.baseURL! + '/spree_oauth/token';

  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', `${testUser.email}`);
  formData.append('password', `${testUser.password}`);

  // Create request context
  const requestContext = await request.newContext();

  // // Make the POST request
  // const response = await requestContext.post(url, {
  //   headers: {
  //     'Set-Cookie': '',
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   data: formData.toString(),
  // });

  console.log('url:', test.info().project.use.baseURL! + '/spree_oauth/token');
  // Make the POST request
  const response = await requestContext.post('http://localhost:3000/spree_oauth/token', {
    headers: {
      'Set-Cookie': '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: formData.toString(),
  });
  console.log('baseURL:', test.info().project.use.baseURL!);

  expect(response.status()).toBe(200);
  let responseJson = await response.json();
  return responseJson;
}

export async function getCookies(context: BrowserContext, name: string) {
  const cookies = await context.cookies();
  return cookies.find((cookie) => cookie.name === name);
}

export async function checkedLoggedIn(context: BrowserContext) {
  expect(getCookies(context, '_spree_starter_session')).toBeTruthy();
}

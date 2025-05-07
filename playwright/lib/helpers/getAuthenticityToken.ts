import { request } from '@playwright/test';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import { User } from '../types/types';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export async function getAuthenticityToken(sessionStoragePath: string, testUser: User) {
  const client = await request.newContext();
  const loginPageResponse = await client.get(baseURL + '/users/sign_in');
  const loginPageHTML = await loginPageResponse.text();
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

  const payload = new URLSearchParams({
    authenticity_token: csrfToken,
    'spree_user[email]': testUser.email,
    'spree_user[password]': testUser.password,
    'user[remember_me]': '0',
    commit: 'Login',
  });
  // Submit login form with the CSRF token
  console.log('step4:', 'sending request');
  const response = await client.post('/users/sign_in', {
    data: payload.toString(),
  });
  console.log('step5:', 'request sent');
  console.log('responseStatus', await response.status());

  // console.log('responseAuth', await response.text())

  // Save session storage it to a file
  await client.storageState({ path: sessionStoragePath });
  console.log('USER_SESSION_STORAGE1', sessionStoragePath);
}

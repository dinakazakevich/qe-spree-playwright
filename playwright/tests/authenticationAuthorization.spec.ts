import { test } from '../lib/fixtures/instantiate';
import { Page } from '@playwright/test';

test.describe('authentication and authorization scenarios', (page: Page) => {
  test('authorization to access admin dashboard as an admin user ', () => {});
  test('no authorization to access admin dashboard as a non-admin user', () => {});
  test('session and cart context is cleared from the browsers on logout', () => {});
  test('loading another customers cart', () => {});
});

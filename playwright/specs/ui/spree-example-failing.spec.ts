import { test, expect } from '@playwright/test';
import { HomePage } from '../../pom/pages/homePage';
import { getCookies } from '../../lib/utils/authUtils';

let homePage: HomePage;

test('has title', async ({ page, context }) => {
  homePage = new HomePage(page);
  await homePage.goto();
  await homePage.navBar.navToAccount();
  expect(getCookies(context, '_spree_starter_session')).toBeTruthy();
});

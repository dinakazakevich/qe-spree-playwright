import { test, expect } from '../../lib/fixtures/instanciatedPage';
import { createCookies } from '../../lib/datafactory/auth';

test('if the access_token got obtained', async ({ page, context }) => {
  // console.log(access_token);
  await page.goto('/');
  await createCookies('spree@example.com', 'spree123');
  await context.storageState({ path: 'storage/state.json' });
});

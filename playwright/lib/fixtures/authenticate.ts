import { test as base, expect } from './instantiate';
import { HomePage } from '../pages/homePage';
import { User } from '../types/types';
import { UserClient } from '../apiClient/userClient';
import { USER_SESSION_STORAGE } from '../datafactory/constants';

type AuthenticatedFixtures = {
  testUser: User;
  userParams?: Partial<User>; // Optional override
  authenticatedHomePage: HomePage;
  authenticatedUserClient: UserClient;
  userClient: UserClient;
};

export const test = base.extend<AuthenticatedFixtures>({
  userParams: [undefined, { option: true }],

  testUser: async ({ userParams, userClient }, use) => {
    const defaultUser = { email: 'default@example.com', password: 'spree123' };
    const mergedUser = { ...defaultUser, ...userParams };
    const exists = await userClient.checkUserExists(mergedUser);
    // Check if the user exists and create the user if necessary
    if (!exists) {
      console.log('User does not exist, creating new user...');
      await userClient.createAccount(mergedUser);
    } else {
      console.log('User already exists:', mergedUser);
    }
    console.log('mergedUser:', mergedUser);
    // Pass the mergedUser to the next step
    await use(mergedUser);
  },
  authenticatedUserClient: async ({ playwright, userClient, testUser }, use) => {
    // const authResponse = await userClient.authenticate(testUser);
    // const { access_token } = await authResponse.json();

    // const authContext = await playwright.request.newContext({
    //   extraHTTPHeaders: {
    //     Authorization: `Bearer ${access_token}`,
    //     'Content-Type': 'application/vnd.api+json',
    //   },
    // });
    // expect(authResponse.ok()).toBeTruthy();

    // // Parse response to get token data
    // const authData = await authResponse.json();

    // // Store token data
    // userClient.tokenData = authData;

    // // Create auth headers for future requests
    // this.headers = {
    //   'Authorization': `Bearer ${authData.access_token}`
    // };

    // return authData;
    const authResponse = await userClient.authenticate(testUser);
    const authData = await authResponse.json();
    console.log('authData:', authData);
    // expect(authResponse.ok()).toBeTruthy();
    userClient.tokenData = authData.access_token;
    const access_token_value = userClient.tokenData;
    console.log('access_token_value:', access_token_value);
    // Parse response to get token data
    // const authData = await authResponse.json();

    // // Create a new request context with auth headers
    // const authContext = await playwright.request.newContext({
    //   extraHTTPHeaders: {
    //     Authorization: `Bearer ${userClient.tokenData.access_token}`,
    //     'Content-Type': 'application/vnd.api+json',
    //   },
    // });

    // // Create authenticated client
    // const authenticatedClient = new UserClient(authContext);

    // await authContext.storageState({ path: USER_SESSION_STORAGE });
    await use(userClient);
    // await authContext.dispose();
  },

  // const authenticatedClient = new UserClient(authContext);

  // await authContext.storageState({ path: USER_SESSION_STORAGE });

  // await use(authenticatedClient);

  // await authContext.dispose();
  // },
  authenticatedHomePage: async ({ homePage, testUser, context }, use) => {
    await homePage.goto();
    await homePage.navBar.navToAccount();
    await homePage.loginForm.doLogin(testUser);

    // Confirm login is successful
    await homePage.loginSuccess();
    await context.storageState({ path: USER_SESSION_STORAGE });

    // Pass the authenticated page object back to the test
    await use(homePage);
  },
});

export { expect } from '@playwright/test';

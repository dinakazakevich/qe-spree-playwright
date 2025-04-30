import { faker } from '@faker-js/faker';
import { User } from '../types/types';

export const adminUser: User = {
  email: process.env.ADMIN_EMAIL!,
  password: process.env.ADMIN_PASSWORD!,
};

export const adminAccessTokenFile = 'playwright/.auth/adminAccessToken.json';

export function generateUser(): User {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };
}

export function generateAddress(): Address {
  /** */
}

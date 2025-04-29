import { faker } from '@faker-js/faker';
import { User } from '../types/user';

export function generateUser(): User {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };
}

export function mathRandom(min: number = 0, max: number): number {
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNumber;
}

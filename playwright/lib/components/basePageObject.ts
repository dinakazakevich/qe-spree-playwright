import { type Locator } from 'playwright';
// import { User } from '../../lib/types/user';

export abstract class PageObject {
  public host: Locator;
  // public testUser: User;

  constructor(host: Locator) {
    this.host = host;
  }

  async click() {
    await this.host.click();
  }
}

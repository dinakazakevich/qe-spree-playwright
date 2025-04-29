import { type Locator } from 'playwright';

export abstract class PageObject {
  public host: Locator;

  constructor(host: Locator) {
    this.host = host;
  }

  async click() {
    await this.host.click();
  }
}

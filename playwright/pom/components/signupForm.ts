import { type Locator } from '@playwright/test';
import { PageObject } from './basePageObject';
import { User } from '../../lib/types/user';

export class SignupForm extends PageObject {
  public readonly header: Locator = this.host.getByRole('heading');
  protected readonly emailInput: Locator = this.host.getByRole('textbox', { name: 'Email' });
  protected readonly passwordInput: Locator = this.host.getByRole('textbox', { name: 'Password' });
  protected readonly signupLink: Locator = this.host.getByRole('link', { name: 'Sign Up' });
  protected readonly singUpButton: Locator = this.host.getByRole('button', { name: 'Sign Up' });
  protected readonly forgotPasswordLink: Locator = this.host.getByRole('link', { name: 'Forgot Password' });
  protected readonly rememberCheckbox: Locator = this.host.getByRole('checkbox', { name: 'Remember me' });
  protected readonly passwordConfirmation: Locator = this.host.getByRole('textbox', { name: 'Password Confirmation' });

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmation(password: string) {
    await this.passwordConfirmation.fill(password);
  }

  async signUp(testUser: User) {
    await this.signupLink.click();
    await this.fillEmail(testUser.email);
    await this.fillPassword(testUser.password);
    await this.fillConfirmation(testUser.password);
    await this.singUpButton.click();
  }

  // TODO: add goto password reset and switch between login/signup
  // TODO: add tests for negative scenarios, error handling etc.
}

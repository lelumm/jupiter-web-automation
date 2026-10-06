import type { Locator, Page } from '@playwright/test';
import type { ContactDetails } from '../test-data/contact';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly forename: Locator;
  readonly email: Locator;
  readonly message: Locator;
  readonly submitButton: Locator;

  readonly forenameError: Locator;
  readonly emailError: Locator;
  readonly messageError: Locator;

  /** Shown while the (slow) submission is in flight */
  readonly sendingIndicator: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.forename = page.getByRole('textbox', { name: 'Forename' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.message = page.getByRole('textbox', { name: 'Message' });
    this.submitButton = page.getByRole('link', { name: 'Submit' });

    this.forenameError = page.getByText('Forename is required');
    this.emailError = page.getByText('Email is required');
    this.messageError = page.getByText('Message is required');

    this.sendingIndicator = page.getByRole('heading', { name: 'Sending Feedback' });
    this.successMessage = page.getByText(/we appreciate your feedback/i);
  }

  get mandatoryErrors(): Locator[] {
    return [this.forenameError, this.emailError, this.messageError];
  }

  async submit() {
    await this.submitButton.click();
  }

  async fillMandatoryFields(details: ContactDetails) {
    await this.forename.fill(details.forename);
    await this.email.fill(details.email);
    await this.message.fill(details.message);
  }
}

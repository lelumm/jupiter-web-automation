import { BasePage } from './BasePage';
import { ContactPage } from './ContactPage';

export class HomePage extends BasePage {
  async goto() {
    await this.page.goto('/');
  }

  async goToContact(): Promise<ContactPage> {
    await this.nav.contact.click();
    return new ContactPage(this.page);
  }
}

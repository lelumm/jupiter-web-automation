import { test, expect } from '../../fixtures';
import { VALID_CONTACT } from '../../test-data/contact';

test('TC1: mandatory field errors appear on empty submit and clear once populated @regression', async ({ homePage }) => {
  const contact = await test.step('From the home page go to contact page', async () => {
    await homePage.goto();
    return homePage.goToContact();
  });

  await test.step('Click submit button', () => contact.submit());

  await test.step('Verify error messages', async () => {
    for (const error of contact.mandatoryErrors) {
      await expect(error).toBeVisible();
    }
  });

  await test.step('Populate mandatory fields', () => contact.fillMandatoryFields(VALID_CONTACT));

  await test.step('Validate errors are gone', async () => {
    for (const error of contact.mandatoryErrors) {
      await expect(error).toBeHidden();
    }
  });
});

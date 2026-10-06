import { test, expect } from '../../fixtures';
import { VALID_CONTACT } from '../../test-data/contact';

// The site takes ~15s to confirm a submission
const SUBMISSION_TIMEOUT = 60_000;
const SUBMISSION_RUNS = 5;

// Run as 5 independent tests to prove a 100% pass rate
for (let run = 1; run <= SUBMISSION_RUNS; run++) {
  test(`TC2: valid submission shows success message (run ${run}/${SUBMISSION_RUNS}) @smoke`, async ({ homePage }) => {
    const contact = await test.step('From the home page go to contact page', async () => {
      await homePage.goto();
      return homePage.goToContact();
    });

    await test.step('Populate mandatory fields', () => contact.fillMandatoryFields(VALID_CONTACT));
    await test.step('Click submit button', () => contact.submit());

    await test.step('Validate successful submission message', async () => {
      await expect(contact.successMessage).toBeVisible({ timeout: SUBMISSION_TIMEOUT });
      await expect(contact.successMessage).toContainText(`Thanks ${VALID_CONTACT.forename}`);
    });
  });
}

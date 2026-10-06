export interface ContactDetails {
  forename: string;
  email: string;
  message: string;
}

export const VALID_CONTACT: ContactDetails = {
  forename: 'John',
  email: 'john.example@planit.net.au',
  message: 'Hello Jupiter Toys, this is an automated test message.',
};

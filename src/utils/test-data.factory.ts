import { faker } from '@faker-js/faker';

export interface CustomerData {
  firstName: string;
  lastName: string;
  postalCode: string;
  email: string;
  phone: string;
}

export class TestDataFactory {
  /**
   * Generates a realistic customer with localized data
   */
  static createCustomer(overrides: Partial<CustomerData> = {}): CustomerData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode('#####'),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      ...overrides,
    };
  }

  /**
   * Curated negative cases for edge and boundary testing
   */
  static readonly NEGATIVE_CHECKOUT_CASES = [
    {
      description: 'Missing first name',
      data: { firstName: '', lastName: 'Doe', postalCode: '28001' },
      expectedError: 'Error: First Name is required',
    },
    {
      description: 'Missing last name',
      data: { firstName: 'Jane', lastName: '', postalCode: '28001' },
      expectedError: 'Error: Last Name is required',
    },
    {
      description: 'Missing postal code',
      data: { firstName: 'Jane', lastName: 'Doe', postalCode: '' },
      expectedError: 'Error: Postal Code is required',
    },
  ] as const;
}

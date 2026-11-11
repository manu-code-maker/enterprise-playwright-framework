import { describe, it, expect } from 'bun:test';
import { productSchema, productListResponseSchema } from '../../src/api/schemas/product.schema.js';
import { userLoginResponseSchema } from '../../src/api/schemas/user.schema.js';
import { TestDataFactory } from '../../src/utils/test-data.factory.js';
import { ENV } from '../../src/config/env.config.js';

describe('Enterprise Playwright Framework - Unit & Contract Verification', () => {
  describe('Environment Configuration (Zod)', () => {
    it('should load default configuration values safely', () => {
      expect(ENV.BASE_URL).toBe('https://www.saucedemo.com');
      expect(ENV.STANDARD_USER).toBe('standard_user');
      expect(ENV.DEFAULT_TIMEOUT).toBeGreaterThan(0);
    });
  });

  describe('Contract Schemas (Strict Objects)', () => {
    it('should validate conforming product payload', () => {
      const validProduct = {
        id: 101,
        title: 'Enterprise Test Runner',
        price: 99.99,
        category: 'developer-tools',
      };
      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject payload with unrecognized properties (strictObject prevents drift)', () => {
      const driftingProduct = {
        id: 101,
        title: 'Enterprise Test Runner',
        price: 99.99,
        category: 'developer-tools',
        unannouncedInternalField: 'leaked-data',
      };
      const result = productSchema.safeParse(driftingProduct);
      expect(result.success).toBe(false);
    });

    it('should validate paginated product list structure', () => {
      const validList = {
        products: [
          { id: 1, title: 'Item 1', price: 10, category: 'test' },
          { id: 2, title: 'Item 2', price: 20, category: 'test' },
        ],
        total: 2,
        skip: 0,
        limit: 10,
      };
      const result = productListResponseSchema.safeParse(validList);
      expect(result.success).toBe(true);
    });
  });

  describe('Test Data Factory (Faker & Static Negatives)', () => {
    it('should generate localized customer with non-empty attributes', () => {
      const customer = TestDataFactory.createCustomer();
      expect(customer.firstName.length).toBeGreaterThan(0);
      expect(customer.lastName.length).toBeGreaterThan(0);
      expect(customer.postalCode.length).toBeGreaterThan(0);
      expect(customer.email).toContain('@');
    });

    it('should allow attribute overriding in factory', () => {
      const customer = TestDataFactory.createCustomer({ postalCode: '28001' });
      expect(customer.postalCode).toBe('28001');
    });

    it('should contain curated negative checkout test cases', () => {
      expect(TestDataFactory.NEGATIVE_CHECKOUT_CASES.length).toBe(3);
      for (const testCase of TestDataFactory.NEGATIVE_CHECKOUT_CASES) {
        expect(testCase.expectedError).toContain('Error:');
      }
    });
  });
});

import { test, expect } from '../../src/fixtures/base.fixture.js';

test.describe('Products API & Contract Schema Validation', () => {
  test('should fetch product list matching strict Zod contract schema @api @contract', async ({ apiClient }) => {
    const limit = 5;
    const { data, raw } = await apiClient.getProducts(limit, 0);

    expect(raw.status()).toBe(200);
    expect(data.limit).toBe(limit);
    expect(data.products.length).toBe(limit);

    // Verify first product fields
    const firstProduct = data.products[0];
    expect(firstProduct.id).toBeGreaterThan(0);
    expect(typeof firstProduct.title).toBe('string');
    expect(typeof firstProduct.price).toBe('number');
  });

  test('should fetch product by ID conforming to strict contract @api @contract', async ({ apiClient }) => {
    const productId = 1;
    const { data, raw } = await apiClient.getProductById(productId);

    expect(raw.status()).toBe(200);
    expect(data.id).toBe(productId);
    expect(data.price).toBeGreaterThanOrEqual(0);
  });
});

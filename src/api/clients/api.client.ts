import { APIRequestContext, APIResponse } from '@playwright/test';
import { productListResponseSchema, productSchema, Product, ProductListResponse } from '../schemas/product.schema.js';
import { userLoginResponseSchema, UserLoginResponse } from '../schemas/user.schema.js';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Retrieves products with contract schema validation
   */
  async getProducts(limit = 10, skip = 0): Promise<{ data: ProductListResponse; raw: APIResponse }> {
    const raw = await this.request.get(`/products?limit=${limit}&skip=${skip}`);
    if (!raw.ok()) {
      throw new Error(`Failed to fetch products: ${raw.status()} ${raw.statusText()}`);
    }
    const json = await raw.json();
    const parsed = productListResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error(`API Contract Violation on /products:\n${JSON.stringify(parsed.error.format(), null, 2)}`);
    }
    return { data: parsed.data, raw };
  }

  /**
   * Retrieves a single product by ID with contract schema validation
   */
  async getProductById(id: number): Promise<{ data: Product; raw: APIResponse }> {
    const raw = await this.request.get(`/products/${id}`);
    if (!raw.ok()) {
      throw new Error(`Failed to fetch product ${id}: ${raw.status()} ${raw.statusText()}`);
    }
    const json = await raw.json();
    const parsed = productSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error(`API Contract Violation on /products/${id}:\n${JSON.stringify(parsed.error.format(), null, 2)}`);
    }
    return { data: parsed.data, raw };
  }

  /**
   * Authenticates user against auth endpoint
   */
  async login(username: string, password: string): Promise<{ data: UserLoginResponse; raw: APIResponse }> {
    const raw = await this.request.post('/auth/login', {
      data: { username, password, expiresInMins: 30 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!raw.ok()) {
      throw new Error(`Login failed with status ${raw.status()}`);
    }
    const json = await raw.json();
    const parsed = userLoginResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error(`API Contract Violation on /auth/login:\n${JSON.stringify(parsed.error.format(), null, 2)}`);
    }
    return { data: parsed.data, raw };
  }
}

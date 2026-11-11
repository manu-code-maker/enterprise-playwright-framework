# Agentic Governance Constitution: Enterprise Playwright Framework

This repository adheres to strict engineering constraints for both human engineers and AI coding agents (Claude Code, Cursor, Copilot, Antigravity). Any pull request violating these principles will be rejected.

---

## 1. Absolute Invariants (WON'T)

1. **NO Arbitrary Sleeps (`page.waitForTimeout`)**:
   - Never write `await page.waitForTimeout(...)` or `sleep()`.
   - Use Playwright's native auto-waiting mechanisms and web-first assertions (`await expect(locator).toBeVisible()`).
2. **NO Fragile Locators (Raw XPath or deep CSS paths)**:
   - Forbidden: `page.locator('//div[2]/form/input[1]')` or `page.locator('.btn.btn-primary.submit')`.
   - Required: Playwright user-centric locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`).
3. **NO Direct POM Instantiation in Tests**:
   - Forbidden: `const login = new LoginPage(page);` inside a `test()` block.
   - Required: Inject pages via `FrameworkFixtures` defined in `src/fixtures/base.fixture.ts`.
4. **NO Hardcoded Credentials or Secrets**:
   - All credentials and base URLs must resolve through `src/config/env.config.ts` with Zod validation.
5. **NO Contract Loosening**:
   - If an API response fails validation against `src/api/schemas/`, never weaken the schema (`z.any()`). Flag the contract change or update the contract specification deliberately.

---

## 2. Mandatory Patterns (MUST)

### A. Fixture Dependency Injection
Every test file must import `test` and `expect` from the framework fixture:
```typescript
import { test, expect } from '../../src/fixtures/base.fixture.js';

test('example scenario', async ({ loginPage, inventoryPage }) => {
  await loginPage.open();
  // ...
});
```

### B. Traceable Step Execution
All user journey actions must be wrapped in `test.step()` for crystal-clear forensics in Playwright HTML and Allure reports:
```typescript
await test.step('1. Add product to basket', async () => {
  await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
  await inventoryPage.navbar.expectCartCount(1);
});
```

### C. Web-First Assertions
Always assert on locators, never on detached primitives:
```typescript
// RIGHT
await expect(checkoutPage.completeHeader).toBeVisible();
await expect(checkoutPage.completeHeader).toHaveText(/thank you for your order/i);

// WRONG
const text = await checkoutPage.completeHeader.innerText();
expect(text).toContain('Thank you');
```

### D. Dynamic Test Data Generation
Use `TestDataFactory.createCustomer()` for positive flows and `TestDataFactory.NEGATIVE_CHECKOUT_CASES` for negative boundary testing.

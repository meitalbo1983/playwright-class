import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { VALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

test.describe("Problem Users Tests", () => {
  test.beforeEach("Open Login Page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
  });

  test("Problem user - verify image loading issues", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(
      VALID_USERS.problem_user.username,
      VALID_USERS.problem_user.password
    );

    // Verify login successful
    await expect(page).toHaveURL(URLS.inventoryPage);

    // Check if images are broken (problem user has broken images)
    const productImages = await inventoryPage.getAllProductImages();
    for (const image of productImages) {
      const imageSrc = await image.getAttribute("src");
      expect(imageSrc).toBeTruthy();
      // Verify that image loads properly
      const response = await page.request.get(imageSrc);
      expect(response.ok()).toBeTruthy();
    }
  });

  test("Performance glitch user - verify load time", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    const startTime = Date.now();

    await loginPage.login(
      VALID_USERS.performance_glitch_user.username,
      VALID_USERS.performance_glitch_user.password
    );

    // Verify login successful
    await expect(page).toHaveURL(URLS.inventoryPage);

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Performance glitch user should take longer to load (but not too long)
    expect(loadTime).toBeGreaterThan(2000); // Should take at least 2 seconds
    expect(loadTime).toBeLessThan(10000); // But not more than 10 seconds

    // Verify page loaded correctly despite performance issues
    await expect(inventoryPage.title).toHaveText("Products");
  });

  test("Error user - verify error handling", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(
      VALID_USERS.error_user.username,
      VALID_USERS.error_user.password
    );

    // Verify login successful
    await expect(page).toHaveURL(URLS.inventoryPage);

    // Try to add item to cart and verify error handling
    await inventoryPage.addItemToCart(0);
    await inventoryPage.openCart();

    // Verify cart behavior with error user
    await expect(cartPage.getCartItems()).resolves.toHaveLength(0);
  });
});

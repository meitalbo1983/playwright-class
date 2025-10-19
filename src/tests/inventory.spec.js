import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { VALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

test.describe("Inventory tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );
    await expect(page).toHaveURL(URLS.inventoryPage);
  });

  test("Can add item to cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test("Can remove item from cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe(1);
    await inventoryPage.removeFromCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test("Can sort products", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts("za");
    const products = await inventoryPage.getProductsList();
    // Verify products are sorted Z to A
    const names = products.map((p) => p.name);
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  test("Can view product details", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const products = await inventoryPage.getProductsList();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("price");
    expect(products[0]).toHaveProperty("description");
  });
});

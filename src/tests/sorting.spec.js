import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { VALID_USERS } from "../data/users.js";

test.describe("Product Sorting Tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );
  });

  test("Sort products by name (A to Z)", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts("az");

    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test("Sort products by name (Z to A)", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts("za");

    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  });

  test("Sort products by price (low to high)", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts("lohi");

    const productPrices = await inventoryPage.getAllProductPrices();
    const prices = productPrices.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test("Sort products by price (high to low)", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortProducts("hilo");

    const productPrices = await inventoryPage.getAllProductPrices();
    const prices = productPrices.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });
});

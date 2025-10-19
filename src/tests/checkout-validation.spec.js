import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage.js";
import { VALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

test.describe("Checkout Validation Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Login and add item to cart before each test
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );

    await inventoryPage.addItemToCart(0);
    await inventoryPage.openCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
  });

  test("Empty fields validation", async ({ page }) => {
    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.continueCheckout("", "", "");
    await expect(checkoutPage.errorMessage).toHaveText(
      "Error: First Name is required"
    );
  });

  test("Only first name provided", async ({ page }) => {
    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.continueCheckout("John", "", "");
    await expect(checkoutPage.errorMessage).toHaveText(
      "Error: Last Name is required"
    );
  });

  test("Missing postal code", async ({ page }) => {
    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.continueCheckout("John", "Doe", "");
    await expect(checkoutPage.errorMessage).toHaveText(
      "Error: Postal Code is required"
    );
  });

  test("Special characters in names", async ({ page }) => {
    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.continueCheckout("John@#$", "Doe!@#", "12345");
    // Should still proceed as the form accepts special characters
    await expect(page).toHaveURL(URLS.checkoutStepTwoPage);
  });

  test("Long input values", async ({ page }) => {
    const checkoutPage = new CheckoutStepOnePage(page);
    const longString = "a".repeat(256);
    await checkoutPage.continueCheckout(longString, longString, longString);
    // Verify the form handles long input gracefully
    await expect(page).toHaveURL(URLS.checkoutStepTwoPage);
  });

  test("Whitespace only values", async ({ page }) => {
    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.continueCheckout("   ", "   ", "   ");
    await expect(checkoutPage.errorMessage).toHaveText(
      "Error: First Name is required"
    );
  });
});

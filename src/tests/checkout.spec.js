import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage.js";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage.js";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage.js";
import { VALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

test.describe("Checkout tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.openLoginPage();
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );

    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
  });

  test("Complete checkout process", async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillForm("John", "Doe", "12345");
    await checkoutStepOne.continue();

    expect(await checkoutStepTwo.getSubtotal()).toBeGreaterThan(0);
    expect(await checkoutStepTwo.getTax()).toBeGreaterThan(0);
    expect(await checkoutStepTwo.getTotal()).toBeGreaterThan(0);

    await checkoutStepTwo.finish();

    expect(await checkoutComplete.getHeaderText()).toBe(
      "Thank you for your order!"
    );
    await checkoutComplete.backToProducts();
    expect(page).toHaveURL(URLS.inventoryPage);
  });

  test("Cannot checkout with empty fields", async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);

    await cartPage.proceedToCheckout();
    await checkoutStepOne.continue();

    expect(await checkoutStepOne.getErrorMessage()).toBe(
      "Error: First Name is required"
    );
  });

  test("Can cancel checkout at step one", async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);

    await cartPage.proceedToCheckout();
    await checkoutStepOne.cancel();

    expect(page).toHaveURL(URLS.cartPage);
  });

  test("Can cancel checkout at step two", async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);

    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillForm("John", "Doe", "12345");
    await checkoutStepOne.continue();
    await checkoutStepTwo.cancel();

    expect(page).toHaveURL(URLS.cartPage);
  });
});

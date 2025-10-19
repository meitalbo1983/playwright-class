import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { VALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

test.describe("Cart tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );
  });

  test("Can add items to cart and view them", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Add items to cart
    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.addToCart("Sauce Labs Bike Light");

    // Go to cart
    await inventoryPage.goToCart();
    expect(page).toHaveURL(URLS.cartPage);

    // Verify items in cart
    const cartItems = await cartPage.getItemsInCart();
    expect(cartItems).toHaveLength(2);
    expect(cartItems[0].name).toBe("Sauce Labs Backpack");
    expect(cartItems[1].name).toBe("Sauce Labs Bike Light");
  });

  test("Can remove items from cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Add item to cart
    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();

    // Remove item
    await cartPage.removeItem("Sauce Labs Backpack");
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test("Can proceed to checkout", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    expect(page).toHaveURL(URLS.checkoutStepOnePage);
  });

  test("Can continue shopping", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    expect(page).toHaveURL(URLS.inventoryPage);
  });
});

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage.js";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage.js";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage.js";
import { VALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

// הגדרת זמן ארוך יותר לבדיקות סאניטי
test.describe("E2E Sanity Tests", () => {
  test.setTimeout(35000); // הגדרת timeout ארוך יותר למקרה של משתמש עם בעיות ביצועים
  test("Complete purchase flow", async ({ page }) => {
    // 1. התחברות למערכת
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );
    await expect(page).toHaveURL(URLS.inventoryPage);

    // 2. הוספת מוצרים לעגלה
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.addToCart("Sauce Labs Bike Light");
    expect(await inventoryPage.getCartCount()).toBe(2);

    // 3. מעבר לעגלת הקניות
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    const cartItems = await cartPage.getItemsInCart();
    expect(cartItems).toHaveLength(2);

    // 4. התחלת תהליך התשלום
    await cartPage.proceedToCheckout();
    const checkoutStepOne = new CheckoutStepOnePage(page);
    await checkoutStepOne.fillForm("ישראל", "ישראלי", "12345");
    await checkoutStepOne.continue();

    // 5. בדיקת סיכום ההזמנה
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const subtotal = await checkoutStepTwo.getSubtotal();
    const tax = await checkoutStepTwo.getTax();
    const total = await checkoutStepTwo.getTotal();

    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBe(subtotal + tax);

    // 6. סיום ההזמנה
    await checkoutStepTwo.finish();
    const checkoutComplete = new CheckoutCompletePage(page);

    expect(await checkoutComplete.getHeaderText()).toBe(
      "Thank you for your order!"
    );

    // 7. חזרה לדף הראשי
    await checkoutComplete.backToProducts();
    await expect(page).toHaveURL(URLS.inventoryPage);
  });
});

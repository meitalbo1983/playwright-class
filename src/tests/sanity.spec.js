import { expect, test } from "@playwright/test";
import { URLS } from "../data/urls.js";
import { VALID_USERS } from "../data/users.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage.js";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage.js";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { LoginPage } from "../pages/LoginPage.js";

// הגדרת זמן ארוך יותר לבדיקות סאניטי
test.describe("E2E Sanity Tests", () => {
	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.openLoginPage();
	});
	test.only("Complete purchase flow", async ({ page }) => {
		// 1. התחברות למערכת
		const loginPage = new LoginPage(page);
		const inventoryPage = new InventoryPage(page);
		await loginPage.login(
			VALID_USERS.standard_user.username,
			VALID_USERS.standard_user.password,
		);
		await expect(page).toHaveURL(URLS.inventoryPage);
		await expect(inventoryPage.title).toHaveText("Products");

		// 2. הוספת מוצרים לעגלה
		await inventoryPage.addToCart("Sauce Labs Backpack");
		await inventoryPage.addToCart("Sauce Labs Bike Light");
		await page.pause()
		await expect(inventoryPage.cartCounter).toHaveText("2");

		// 3. מעבר לעגלת הקניות
		await inventoryPage.goToCart();
		const cartPage = new CartPage(page);
		const cartItems = await cartPage.getItemsInCart();
		await expect(cartItems).toHaveLength(2);

		// 4. התחלת תהליך התשלום
		await cartPage.proceedToCheckout();
		const checkoutStepOne = new CheckoutStepOnePage(page);
		await checkoutStepOne.fillForm("ישראל", "ישראלי", "12345");
		await checkoutStepOne.continue();

		// 5. בדיקת סיכום ההזמנה
		const checkoutStepTwo = new CheckoutStepTwoPage(page);
		await expect(page).toHaveURL(URLS.checkoutStepTwoPage);
		await expect(checkoutStepTwo.title).toHaveText("Checkout: Overview");
		// 6. סיום ההזמנה
		await checkoutStepTwo.finish();
		const checkoutComplete = new CheckoutCompletePage(page);
		await expect(checkoutComplete.title).toHaveText("Checkout: Complete!");
		await expect(checkoutComplete.completeHeader).toHaveText(
			"Thank you for your order!",
		);

		// 7. חזרה לדף הראשי
		await checkoutComplete.backToProducts();
		await expect(page).toHaveURL(URLS.inventoryPage);
	});
});

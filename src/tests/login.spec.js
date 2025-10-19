import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { VALID_USERS, INVALID_USERS } from "../data/users.js";
import { URLS } from "../data/urls.js";

test.describe("Login tests", () => {
  
  test.beforeEach("Open Login Page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
  });
  test("Login with valid user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password
    );
    await expect(page).toHaveURL(URLS.inventoryPage);
    await expect(inventoryPage.title).toHaveText("Products");
  });

  test("Cannot login with locked out user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      INVALID_USERS.locked_out_user.username,
      INVALID_USERS.locked_out_user.password
    );
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });

  test("Cannot login with wrong password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      INVALID_USERS.validUserWrongPassword.username,
      INVALID_USERS.validUserWrongPassword.password
    );
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("Cannot login with empty fields", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", "");
    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: Username is required"
    );
  });
});

import { expect, test } from "@playwright/test";
import { URLS } from "../data/urls.js";
import { INVALID_USERS, VALID_USERS } from "../data/users.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { LoginPage } from "../pages/LoginPage.js";

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
			VALID_USERS.problem_user.password,
		);

		await expect(page).toHaveURL(URLS.inventoryPage);
		await expect(inventoryPage.title).toHaveText("Products");
	});

	test("Performance glitch user - verify load time", async ({ page }) => {
		const loginPage = new LoginPage(page);
		const inventoryPage = new InventoryPage(page);

		await loginPage.login(
			VALID_USERS.performance_glitch_user.username,
			VALID_USERS.performance_glitch_user.password,
		);

		await expect(page).toHaveURL(URLS.inventoryPage);
		await expect(inventoryPage.title).toHaveText("Products");
	});

	test("Error user - verify error handling", async ({ page }) => {
		const loginPage = new LoginPage(page);
		const inventoryPage = new InventoryPage(page);

		await loginPage.login(
			VALID_USERS.error_user.username,
			VALID_USERS.error_user.password,
		);

		await expect(page).toHaveURL(URLS.inventoryPage);
		await expect(inventoryPage.title).toHaveText("Products");
	});
});

test.describe("Negative tests", () => {
	test.beforeEach("Open Login Page", async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.openLoginPage();
	});

	test("Cannot login with locked out user", async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(
			INVALID_USERS.locked_out_user.username,
			INVALID_USERS.locked_out_user.password,
		);
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Sorry, this user has been locked out.",
		);
	});

	test("Cannot login with wrong password", async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(
			INVALID_USERS.validUserWrongPassword.username,
			INVALID_USERS.validUserWrongPassword.password,
		);
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Username and password do not match any user in this service",
		);
	});

	test("Cannot login with empty fields", async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login("", "");
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Username is required",
		);
	});

	test("Cannot login with wrong username and correct password", async ({
		page,
	}) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(
			INVALID_USERS.wrongUsernameCorrectPassword.username,
			INVALID_USERS.wrongUsernameCorrectPassword.password,
		);
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Username and password do not match any user in this service",
		);
	});

	test("Cannot login with wrong username and wrong password", async ({
		page,
	}) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(
			INVALID_USERS.wrongUsernameWrongPassword.username,
			INVALID_USERS.wrongUsernameWrongPassword.password,
		);
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Username and password do not match any user in this service",
		);
	});

	test("Cannot login with empty username and correct password", async ({
		page,
	}) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(
			INVALID_USERS.emptyUsernameCorrectPassword.username,
			INVALID_USERS.emptyUsernameCorrectPassword.password,
		);
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Username is required",
		);
	});

	test("Cannot login with correct username and empty password", async ({
		page,
	}) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(
			INVALID_USERS.correctUsernameEmptyPassword.username,
			INVALID_USERS.correctUsernameEmptyPassword.password,
		);
		await expect(loginPage.errorMessage).toHaveText(
			"Epic sadface: Password is required",
		);
	});
});

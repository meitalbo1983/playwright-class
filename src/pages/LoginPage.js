import { BASE_URL } from "../data/urls.js";

export class LoginPage {
	constructor(page) {
		this.page = page;
		this.userNameField = page.locator('[data-test="username"]');
		this.passwordField = page.locator('[data-test="password"]');
		this.loginButton = page.locator('[data-test="login-button"]');
		this.errorMessage = page.locator('[data-test="error"]');
	}
	async openLoginPage() {
		await this.page.goto(BASE_URL);
	}

	async login(username, password) {
		await this.userNameField.fill(username);
		await this.passwordField.fill(password);
		await this.loginButton.click();
	}
}

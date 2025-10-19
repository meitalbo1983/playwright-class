import { BASE_URL } from "../data/urls.js";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userNameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page
      .getByRole("textbox", { name: "Password" })
      .or(page.locator('[data-test="password"]'));
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.locator('[data-test="error"]');
  }
  async openLoginPage() {
    try {
      await this.page.goto(BASE_URL, { timeout: 30000 });
    } catch (error) {
      console.log("Failed to load page, retrying...");
      await this.page.waitForTimeout(2000);
      await this.page.goto(BASE_URL, { timeout: 30000 });
    }
  }

  async login(username, password) {
    await this.userNameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}

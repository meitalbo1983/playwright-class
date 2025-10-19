import { BASE_URL } from "../data/urls.js";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userNameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
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

export class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillForm(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async validateFields() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
  }

  async validateRequiredFields() {
    await this.continue();
    const errorText = await this.getErrorMessage();
    return errorText === "Error: First Name is required";
  }

  async validateFormValues(firstName, lastName, postalCode) {
    const currentFirstName = await this.firstNameInput.inputValue();
    const currentLastName = await this.lastNameInput.inputValue();
    const currentPostalCode = await this.postalCodeInput.inputValue();

    return (
      currentFirstName === firstName &&
      currentLastName === lastName &&
      currentPostalCode === postalCode
    );
  }
}

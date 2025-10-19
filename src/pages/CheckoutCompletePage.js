export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getHeaderText() {
    return await this.completeHeader.textContent();
  }

  async getCompleteText() {
    return await this.completeText.textContent();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }
}

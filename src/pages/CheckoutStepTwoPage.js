export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.title = page.locator(".title");
  }

  async finish() {
    await this.finishButton.click();
  }
}
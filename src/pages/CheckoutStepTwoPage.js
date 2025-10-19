export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return parseFloat(text.replace("Item total: $", ""));
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return parseFloat(text.replace("Tax: $", ""));
  }

  async getTotal() {
    const text = await this.totalLabel.textContent();
    return parseFloat(text.replace("Total: $", ""));
  }
}

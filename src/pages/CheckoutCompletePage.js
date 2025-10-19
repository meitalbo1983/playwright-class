export class CheckoutCompletePage {
	constructor(page) {
		this.page = page;
    this.title = page.locator(".title");
		this.completeHeader = page.locator(".complete-header");
		this.completeText = page.locator(".complete-text");
		this.backHomeButton = page.locator('[data-test="back-to-products"]');
	}

	async backToProducts() {
		await this.backHomeButton.click();
	}
}

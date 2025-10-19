export class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
  }

  async getItemsInCart() {
    const items = [];
    const cartItems = await this.cartItems.all();
    for (const item of cartItems) {
      items.push({
        name: await item.locator(".inventory_item_name").textContent(),
        price: await item.locator(".inventory_item_price").textContent(),
        quantity: await item.locator(".cart_quantity").textContent(),
      });
    }
    return items;
  }

  async removeItem(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('[data-test*="remove"]').click();
  }

  async validateItemPrice(productName, expectedPrice) {
    const item = this.cartItems.filter({ hasText: productName });
    const priceText = await item.locator(".inventory_item_price").textContent();
    return parseFloat(priceText.replace("$", "")) === expectedPrice;
  }

  async getItemTotal() {
    const items = await this.getItemsInCart();
    return items.reduce((total, item) => {
      return (
        total +
        parseFloat(item.price.replace("$", "")) * parseInt(item.quantity)
      );
    }, 0);
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getItemCount() {
    const items = await this.cartItems.all();
    return items.length;
  }
}

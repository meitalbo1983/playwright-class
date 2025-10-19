export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartIcon = page.locator(".shopping_cart_link");
    this.cartCounter = page.locator(".shopping_cart_badge");
    this.inventoryItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async addToCart(productName) {
    const item = this.page
      .locator(".inventory_item")
      .filter({ hasText: productName });
    const addButton = item.locator('[data-test^="add-to-cart"]');
    await addButton.click();
  }

  async removeFromCart(productName) {
    const item = this.page
      .locator(".inventory_item")
      .filter({ hasText: productName });
    const removeButton = item.locator('[data-test*="remove"]');
    await removeButton.click();
  }

  async sortProducts(sortOption) {
    // אפשרויות המיון:
    // az - Name (A to Z)
    // za - Name (Z to A)
    // lohi - Price (low to high)
    // hilo - Price (high to low)
    await this.page
      .locator('[data-test="product_sort_container"]')
      .selectOption(sortOption);
  }

  async getProductPrice(productName) {
    const item = this.page
      .locator(".inventory_item")
      .filter({ hasText: productName });
    const priceText = await item.locator(".inventory_item_price").textContent();
    return parseFloat(priceText.replace("$", ""));
  }

  async getCartCount() {
    try {
      const count = await this.cartCounter.textContent();
      return parseInt(count);
    } catch {
      return 0;
    }
  }

  async goToCart() {
    await this.shoppingCartIcon.click();
  }

  async getProductsList() {
    const products = [];
    const items = await this.inventoryItems.all();
    for (const item of items) {
      products.push({
        name: await item.locator(".inventory_item_name").textContent(),
        price: await item.locator(".inventory_item_price").textContent(),
        description: await item.locator(".inventory_item_desc").textContent(),
      });
    }
    return products;
  }
}

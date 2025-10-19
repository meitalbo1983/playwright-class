export class InventoryPage {
	constructor(page) {
		this.page = page;
		this.title = page.locator('[data-test="title"]');
		this.shoppingCartIcon = page.locator(".shopping_cart_link");
		this.cartCounter = page.locator(".shopping_cart_badge");
		this.inventoryItems = page.locator(".inventory_item");
		this.sortDropdown = page.locator('[data-test="product_sort_container"]');
		this.productImages = page.locator(".inventory_item img");
		this.productNames = page.locator(".inventory_item_name");
		this.productPrices = page.locator(".inventory_item_price");
	}

	async addItemToCart(index) {
		const addButtons = await this.page
			.locator('[data-test^="add-to-cart"]')
			.all();
		await addButtons[index].click();
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
		const options = {
			az: "az", // Name (A to Z)
			za: "za", // Name (Z to A)
			lohi: "lohi", // Price (low to high)
			hilo: "hilo", // Price (high to low)
		};
		await this.sortDropdown.selectOption(options[sortOption]);
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

	async openCart() {
		await this.shoppingCartIcon.click();
	}

	async getAllProductImages() {
		return await this.productImages.all();
	}

	async getAllProductNames() {
		const elements = await this.productNames.all();
		const names = [];
		for (const element of elements) {
			names.push(await element.textContent());
		}
		return names;
	}

	async getAllProductPrices() {
		const elements = await this.productPrices.all();
		const prices = [];
		for (const element of elements) {
			prices.push(await element.textContent());
		}
		return prices;
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

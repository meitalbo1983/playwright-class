export class InventoryPage {
  constructor(page) {
    this.page = page
    this.title = page.locator('[data-test="title"]')
  }
}

import {test, expect} from '@playwright/test'
import {LoginPage} from '../pages/LoginPage.js'
import {InventoryPage} from '../pages/InventoryPage.js'
import {VALID_USERS} from '../data/users.js'
import {URLS} from '../data/urls.js'

test.describe('Valid login tests', () => {
  // Pre-Condition: פתיחת דף הבית
  test.beforeEach('Open Login Page', async ({page}) => {
    const loginPage = new LoginPage(page)
    await loginPage.openLoginPage()
  })
  // Test Case 1: כניסה עם משתמש תקין
  test('Login with valid user', async ({page}) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    loginPage.login(
      VALID_USERS.standard_user.username,
      VALID_USERS.standard_user.password,
    )
    await expect(page).toHaveURL(URLS.inventoryPage)
    await expect(inventoryPage.title).toHaveText('Products')
  })
})

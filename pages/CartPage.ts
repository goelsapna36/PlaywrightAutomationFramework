import { Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly carttitle: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly productName: Locator;
    readonly productDescription: Locator;
    readonly productPrice: Locator;
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.carttitle =
            page.locator('.title');

        this.continueShoppingButton =
            page.locator('#continue-shopping');

        this.checkoutButton =
            page.locator('#checkout');

        this.productName =
            page.locator('.inventory_item_name');

        this.productDescription =
            page.locator('.inventory_item_desc');

        this.productPrice =
            page.locator('[data-test="inventory-item-price"]');

        this.removeButton =
            page.locator('[data-test^="remove-"]');
    }

    async getFirstProductDetails() {
        const firstProductName =
            await this.productName.first().textContent();

        const firstProductDescription =
            await this.productDescription.first().textContent();

        const firstProductPrice =
            await this.productPrice.first().textContent();

        return {
            name: firstProductName,
            description: firstProductDescription,
            price: firstProductPrice
        };
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    async clickRemoveButton() {
        await this.removeButton.first().click();
    }
}
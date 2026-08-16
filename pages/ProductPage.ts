import { Page, Locator } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    readonly settingIcon: Locator;
    readonly logoutLink: Locator;
    readonly aboutLink: Locator;
    readonly productName: Locator;
    readonly productDescription: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;

    readonly filterDropdown: Locator;
    readonly filternameAtoZ: Locator;
    readonly filternameZtoA: Locator

    readonly filterPriceLowToHigh: Locator;
    readonly filterPriceHighToLow: Locator;



    constructor(page: Page) {
        this.page = page;

        // this.settingIcon = page.locator('#react-burger-menu-btn');
        // this.aboutLink = page.locator('#about_sidebar_link');
this.productName = page.locator('.inventory_item_name')
this.productDescription = page.locator('.inventory_item_desc')
this.productPrice = page.locator('[data-test="inventory-item-price"]')
this.addToCartButton = page
    .locator('.btn.btn_primary.btn_small.btn_inventory');
    }

    // async clickSettingIcon() {
    //     await this.settingIcon.click();
    // }

    // async clickaboutLink() {
    //     await this.aboutLink.click();
 async getAllProductNames(): Promise<string[]> {
    return await this.productName.allTextContents();
}

async getAllProductDescriptions(): Promise<string[]> {
    return await this.productDescription.allTextContents();
}

async getAllProductPrices(): Promise<string[]> {
    return await this.productPrice.allTextContents();
}

async getAllAddToCartButtons(): Promise<string[]> {
    return await this.addToCartButton.allTextContents();
}
}
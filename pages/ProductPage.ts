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
    this.filterDropdown = page.locator('[data-test="product-sort-container"]');

    this.filternameAtoZ = page.locator('[data-test="product-sort-container"] option[value="az"]'
    );
    this.filternameZtoA = page.locator(
        '[data-test="product-sort-container"] option[value="za"]'
    );  
    this.filterPriceLowToHigh = page.locator(
        '[data-test="product-sort-container"] option[value="lohi"]'
    );      
    this.filterPriceHighToLow = page.locator(
        '[data-test="product-sort-container"] option[value="hilo"]'
    );  
    



    // async clickSettingIcon() {
    //     await this.settingIcon.click();
    // }

    // async clickaboutLink() {
    //     await this.aboutLink.click();
    }
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

async filterProducts(filter: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.filterDropdown.selectOption(filter);
}

async getSelectedFilter(): Promise<string> {
    return await this.filterDropdown.inputValue();
}

}

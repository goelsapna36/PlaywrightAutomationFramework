import { Page, Locator } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    readonly settingIcon: Locator;
    readonly logoutLink: Locator;
    readonly aboutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.settingIcon = page.locator('#react-burger-menu-btn');
        this.aboutLink = page.locator('#about_sidebar_link');

        //this.logoutLink =page.locator('[data-test="logout-sidebar-link"]');
    }

    async clickSettingIcon() {
        await this.settingIcon.click();
    }       
    async clickaboutLink() {
        await this.aboutLink.click();
    }
    // async clicklogoutLink() {
    //     await this.logoutLink.click();

}
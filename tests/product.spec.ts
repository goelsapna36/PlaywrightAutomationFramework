import { test, expect } from '../fixtures/testFixtures';
import { testData } from '../utils/testData';
import { ProductPage } from '../pages/ProductPage';

test(
    'User should login successfully and validate all products',
    { tag: '@regression' },
    async ({ page, loginPage }) => {

        await page.goto('/');

        await loginPage.login(
            testData.login.username,
            testData.login.password
        );

        // Check URL after login
        await expect(page).toHaveURL(
            'https://www.saucedemo.com/inventory.html'
        );

        const productPage = new ProductPage(page);

        // Get all product names
        const productNames = await productPage.getAllProductNames();
        console.log('Product Names:', productNames);

        expect(productNames).toContain('Sauce Labs Backpack');

        // Get all product descriptions
        const productDescriptions =
            await productPage.getAllProductDescriptions();

        console.log('Product Descriptions:', productDescriptions);

        expect(productDescriptions[0])
            .toContain('carry.allTheThings');

        // Get all product prices
        const productPrices = await productPage.getAllProductPrices();

        console.log('Product Prices:', productPrices);

        expect(productPrices).toContain('$29.99');

        // Get all Add to Cart button texts
        const addToCartButtons =
            await productPage.getAllAddToCartButtons();

        console.log('Add to Cart Buttons:', addToCartButtons);

        expect(addToCartButtons).toHaveLength(6);
    }
);
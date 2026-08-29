import { test, expect } from '../fixtures/testFixtures';
import { ProductPage } from '../pages/ProductPage';

test(
    'User should login successfully and validate all products',
    { tag: '@regression' },
    async ({ page, loggedInPage }) => {

        const productPage = new ProductPage(page);

        // Product Names
        const productNames =
            await productPage.getAllProductNames();

        console.log('Product Names:', productNames);

        expect(productNames)
            .toContain('Sauce Labs Backpack');


        // Product Descriptions
        const productDescriptions =
            await productPage.getAllProductDescriptions();

        console.log(
            'Product Descriptions:',
            productDescriptions
        );

        expect(productDescriptions[0])
            .toContain('carry.allTheThings');


        // Product Prices
        const productPrices =
            await productPage.getAllProductPrices();

        console.log(
            'Product Prices:',
            productPrices
        );

        expect(productPrices)
            .toContain('$29.99');


        // Add to Cart Buttons
        const addToCartButtons =
            await productPage.getAllAddToCartButtons();

        console.log(
            'Add to Cart Buttons:',
            addToCartButtons
        );

        expect(addToCartButtons)
            .toHaveLength(6);


        // A to Z
        await productPage.filterProducts('az');

        const namesAZ =
            await productPage.getAllProductNames();

        expect(namesAZ)
            .toEqual([...namesAZ].sort());


        // Z to A
        await productPage.filterProducts('za');

        const namesZA =
            await productPage.getAllProductNames();

        expect(namesZA)
            .toEqual([...namesZA].sort().reverse());


        // Price Low to High
        await productPage.filterProducts('lohi');

        const pricesLow =
            await productPage.getAllProductPrices();

        const lowPrices = pricesLow.map(price =>
            Number(price.replace('$', ''))
        );

        expect(lowPrices)
            .toEqual(
                [...lowPrices].sort((a, b) => a - b)
            );


        // Price High to Low
        await productPage.filterProducts('hilo');

        const pricesHigh =
            await productPage.getAllProductPrices();

        const highPrices = pricesHigh.map(price =>
            Number(price.replace('$', ''))
        );

        expect(highPrices)
            .toEqual(
                [...highPrices].sort((a, b) => b - a)
            );
    }
);
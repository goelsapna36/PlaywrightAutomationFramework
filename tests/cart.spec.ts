import { test, expect } from '../fixtures/testFixtures';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';


test(
    'User should be able to add products to cart and validate cart contents',
    async ({ page, loggedInPage }) => {

        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);


        // ==========================================
        // Get First Product Details
        // ==========================================

        const productName =
            await productPage.productName
                .first()
                .textContent();

        const productDescription =
            await productPage.productDescription
                .first()
                .textContent();

        const productPrice =
            await productPage.productPrice
                .first()
                .textContent();

        console.log(
            'Product Name:',
            productName
        );

        console.log(
            'Product Description:',
            productDescription
        );

        console.log(
            'Product Price:',
            productPrice
        );


        // ==========================================
        // Add First Product To Cart
        // ==========================================

        await productPage.addToCartButton
            .first()
            .click();


        // ==========================================
        // Open Cart
        // ==========================================

        await productPage.cartbutton.click();


        // ==========================================
        // Verify Cart URL
        // ==========================================

        await expect(page).toHaveURL(
            'https://www.saucedemo.com/cart.html'
        );


        // ==========================================
        // Verify Cart Title
        // ==========================================

        await expect(cartPage.carttitle)
            .toHaveText('Your Cart');


        // ==========================================
        // Get Product Details From Cart
        // ==========================================

        const cartProductDetails =
            await cartPage.getFirstProductDetails();

        console.log(
            'Cart Product Name:',
            cartProductDetails.name
        );

        console.log(
            'Cart Product Description:',
            cartProductDetails.description
        );

        console.log(
            'Cart Product Price:',
            cartProductDetails.price
        );


        // ==========================================
        // Validate Product Details
        // ==========================================

        expect(cartProductDetails.name)
            .toBe(productName);

        expect(cartProductDetails.description)
            .toBe(productDescription);

        expect(cartProductDetails.price)
            .toBe(productPrice);


        // ==========================================
        // Checkout Button Should Be Visible
        // ==========================================

        await expect(cartPage.checkoutButton)
            .toBeVisible();
    }
);


test(
    'Remove product from cart and validate cart is empty',
    async ({ page, loggedInPage }) => {

        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);


        // ==========================================
        // Add First Product
        // ==========================================

        await productPage.addToCartButton
            .first()
            .click();


        // ==========================================
        // Open Cart
        // ==========================================

        await productPage.cartbutton.click();


        // ==========================================
        // Verify Cart URL
        // ==========================================

        await expect(page).toHaveURL(
            'https://www.saucedemo.com/cart.html'
        );


        // ==========================================
        // Verify Product Is Present
        // ==========================================

        await expect(cartPage.productName)
            .toHaveCount(1);


        // ==========================================
        // Remove Product
        // ==========================================

        await cartPage.clickRemoveButton();


        // ==========================================
        // Verify Cart Is Empty
        // ==========================================

        await expect(cartPage.productName)
            .toHaveCount(0);

        
    }
);
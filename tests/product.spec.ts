import{test,expect}from'../fixtures/testFixtures';
import{testData}from'../utils/testData';
import{ProductPage}from'../pages/ProductPage';


test(
  'User should login successfully and navigate to about page',
  { tag: '@regression' },
  async ({ page, loginPage }) => {
  await page.goto('/');

  await loginPage.login(
    testData.login.username,
    testData.login.password
  );

  const productPage = new ProductPage(page);
  await productPage.clickSettingIcon();
  await productPage.clickaboutLink();
  expect(page.url()).toContain('https://www.saucedemo.com/inventory.html');
});
import { expect, test } from '@playwright/test';
import { homePageRoute } from '../../src/components/utils/constants.tsx';
import { HomePage } from '../utils/pages/HomePage.ts';
import { NotFoundPage } from '../utils/pages/NotFoundPage.ts';

test('show not found button when unknown URL is found', async ({ page, baseURL }) => {
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    const notFound = new NotFoundPage(page);
    await page.goto(home.getBaseUrl() + '/test');
    await expect(notFound.goBackToHomePageButton).toBeVisible();
    await expect(notFound.notFoundImage).toBeVisible();
    await notFound.goBackToHomePage();
    await expect(page).toHaveURL(home.getBaseUrl() + homePageRoute);
});

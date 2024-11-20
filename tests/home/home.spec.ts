import { expect, test } from '@playwright/test';
import { homePageRoute } from '../../src/components/utils/constants.tsx';
import { HomePage } from '../utils/pages/HomePage.ts';

test('should show home page with links', async ({ page, baseURL }) => {
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    expect(await home.documentationWebsite.getAttribute('href')).toBe('https://eclipse.dev/xpanse');
    expect(await home.configurationLanguageLink.getAttribute('href')).toBe('https://eclipse.dev/xpanse/docs/api');
    await expect(page, 'home page must be opened.').toHaveURL(home.baseUrl + homePageRoute);
    await expect(page, 'page title must always be xpanse').toHaveTitle('xpanse');
});

test('click on logo reloads page', async ({ page, baseURL }) => {
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    await home.logoOnHomePage.click();
    await expect(page, 'Reload redirects to home page').toHaveURL(home.baseUrl + homePageRoute);
});

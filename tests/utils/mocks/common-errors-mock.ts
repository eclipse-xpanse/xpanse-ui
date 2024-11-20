import type { Page } from 'playwright-core';

export async function loadConnectionRefusedMock(page: Page, url: string) {
    await page.route(url, async (route) => {
        await route.abort('connectionrefused');
    });
}

export const loadAuthenticationErrorMock = async (page: Page, url: string) => {
    await page.route(url, async (route) => {
        await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
                resultType: 'Unauthorized',
                details: ['Full authentication is required to access this resource'],
                success: false,
            }),
        });
    });
};

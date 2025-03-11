import { Page } from 'playwright-core';
import { healthCheckUrl } from './endpoints.ts';

export const mockHealthCheckSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(healthCheckUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                healthStatus: 'OK',
            }),
        });
    });
};

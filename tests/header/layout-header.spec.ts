import { expect, test } from '@playwright/test';
import { loadConnectionRefusedMock } from '../utils/mocks/common-errors-mock.ts';
import { healthCheckUrl } from '../utils/mocks/endpoints.ts';
import { mockHealthCheckSuccessResponse } from '../utils/mocks/health-check-mocks.ts';
import { HomePage } from '../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../utils/pages/LayoutHeaderPage.ts';

test('System Status - show error icon when backend not reachable', async ({ page, baseURL }) => {
    let callCount = 0;

    // Intercept requests
    page.on('request', (request) => {
        if (request.url() === healthCheckUrl) {
            callCount++;
        }
    });

    await loadConnectionRefusedMock(page, healthCheckUrl);
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await expect(
        layoutHeader.systemStatusLoadingButton,
        'Button must be disabled when system status is loading'
    ).toBeDisabled();
    await expect(layoutHeader.systemStatusLoadingButton, 'loading icon should be visible initially').toBeVisible();
    await page.waitForTimeout(2000); // wait for API call retries.
    await expect(layoutHeader.systemStatusFailedButton, 'system status button should be visible').toBeVisible();
    await expect(layoutHeader.systemStatusFailedButton, 'system status button should be enabled').toBeEnabled();
    expect(callCount, 'API call to be tried 3 times').toBe(3);
});

test('System Status - show success icon when backend is reachable', async ({ page, baseURL }) => {
    await mockHealthCheckSuccessResponse(page, 3000);
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await expect(
        layoutHeader.systemStatusLoadingButton,
        'Button must be disabled when system status is loading'
    ).toBeDisabled();
    await expect(layoutHeader.systemStatusLoadingButton, 'loading icon should be visible initially').toBeVisible();
    await page.waitForTimeout(5000);
    await expect(layoutHeader.systemStatusSuccessfulButton, 'system status button should be visible').toBeVisible();
    await expect(layoutHeader.systemStatusSuccessfulButton, 'system status button should be enabled').toBeEnabled();
});

test('Show all possible roles - show success icon when backend is reachable', async ({ page, baseURL }) => {
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    await page.waitForTimeout(3000);
    const layoutHeader = new LayoutHeaderPage(page);
    const userNameButton = layoutHeader.userNameButton;
    await userNameButton.hover(); // Just the hovering on the userName makes antD render all menu items to the DOM.
    const adminRole = page.getByRole('menuitem', { name: 'admin' });
    await expect(adminRole, 'admin role is visible in menu').toBeVisible();
    const cspRole = page.getByRole('menuitem', { name: 'csp' });
    await expect(cspRole, 'admin role is visible in menu').toBeVisible();
    const isvRole = page.getByRole('menuitem', { name: 'isv' });
    await expect(isvRole, 'isv role is visible in menu').toBeVisible();
    const endUserRole = page.getByRole('menuitem', { name: 'user' });
    await expect(endUserRole, 'end user role is visible in menu').toBeVisible();
});

test('click on system status refreshes health check data', async ({ page, baseURL }) => {
    let callCount = 0; // Counter for tracking calls

    // Intercept requests
    page.on('request', (request) => {
        if (request.url() === healthCheckUrl) {
            callCount++;
        }
    });
    await mockHealthCheckSuccessResponse(page, 0);
    const home = new HomePage(page, baseURL);
    await home.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.reloadSystemStatus();
    expect(callCount, 'Click on system status button must reload status from backend').toBe(2);
});

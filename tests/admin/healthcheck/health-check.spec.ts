import { expect, test } from '@playwright/test';
import { isElementFullyVisibleInsideViewport } from '../../utils/common/view-port-validation.ts';
import { loadConnectionRefusedMock } from '../../utils/mocks/common-errors-mock.ts';
import { healthCheckUrl } from '../../utils/mocks/endpoints.ts';
import { mockHealthCheckSuccessResponse } from '../../utils/mocks/health-check-mocks.ts';
import { HealthCheckPage } from '../../utils/pages/HealthCheckPage.ts';
import { HomePage } from '../../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../../utils/pages/LayoutHeaderPage.ts';

test('Refresh button should reload healthcheck data', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('admin');
    await mockHealthCheckSuccessResponse(page, 0);
    let apiCallCount = 0;
    page.on('request', (request) => {
        if (request.url().includes(healthCheckUrl)) {
            apiCallCount++;
        }
    });
    const healthCheckMenu = new HealthCheckPage(page);
    await healthCheckMenu.clickHealthCheckMenuItem();
    await page.waitForTimeout(2000);
    await healthCheckMenu.clickRefreshHealthCheckButton();
    await page.waitForTimeout(2000);
    expect(apiCallCount, 'New API call must be done when refresh button is clicked.').toBe(2);
});

test('filtering by backend name works', async ({ page, baseURL }) => {
    await mockHealthCheckSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('admin');
    const healthCheckMenu = new HealthCheckPage(page);
    await healthCheckMenu.clickHealthCheckMenuItem();
    await page.waitForTimeout(5000);
    await page.getByLabel('Name').getByRole('button', { name: 'filter' }).click();
    await page.locator('css=div:nth-child(2) > .ant-tree-checkbox > .ant-tree-checkbox-inner').click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(page.getByRole('cell', { name: 'Terra Boot' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'check-circle OK' })).toBeVisible();
});

test('show error alert when backend is not reachable', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('admin');
    await loadConnectionRefusedMock(page, healthCheckUrl);
    const healthCheckMenu = new HealthCheckPage(page);
    await healthCheckMenu.clickHealthCheckMenuItem();
    await page.waitForTimeout(3000);
    await healthCheckMenu.clickRefreshHealthCheckButton();
    const errorAlert = healthCheckMenu.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(await isElementFullyVisibleInsideViewport(page, errorAlert), 'Error alert must be fully visible.').toBe(
        true
    );
    await mockHealthCheckSuccessResponse(page, 2000);
    await healthCheckMenu.clickRefreshHealthCheckButton();
    await expect(errorAlert, 'Alert should be removed during and after successful reload').not.toBeVisible();
});

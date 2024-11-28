import { expect, test } from '@playwright/test';
import { loadAuthenticationErrorMock } from '../utils/mocks/common-errors-mock.ts';
import { serviceDetailsUrl } from '../utils/mocks/endpoints.ts';
import { mockServiceDetailsSuccessResponse } from '../utils/mocks/service-details-mock.ts';
import { DashboardPage } from '../utils/pages/DashboardPage.ts';
import { HomePage } from '../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../utils/pages/LayoutHeaderPage.ts';

test('Show service statistics when backend is reachable', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    await mockServiceDetailsSuccessResponse(page, 0);

    const dashboard = new DashboardPage(page, baseURL);
    const successfulDeployment = dashboard.getStaticsElementAtPosition(0);
    await expect(successfulDeployment).toBeVisible();
    await expect(successfulDeployment).toHaveText('Successful Deployments');
    expect(await dashboard.getValueOfStatistics(0)).toBe('1');
    const successfulDeploymentValue = dashboard.getLocationOfStatisticElementAtPosition(0);
    await expect(await successfulDeploymentValue).toHaveCSS('color', dashboard.successStaticColor, { timeout: 10000 });
    await successfulDeployment.click();
    await expect(page).toHaveURL(dashboard.successDeploymentRedirectUrl);
    await page.goBack();

    const failedDeployments = dashboard.getStaticsElementAtPosition(1);
    await expect(failedDeployments).toBeVisible();
    await expect(failedDeployments).toHaveText('Failed Deployments');
    expect(await dashboard.getValueOfStatistics(1)).toBe('1');
    const failedDeploymentValue = dashboard.getLocationOfStatisticElementAtPosition(1);
    await expect(await failedDeploymentValue).toHaveCSS('color', dashboard.failureStaticColor, { timeout: 10000 });
    await failedDeployments.click();
    await expect(page).toHaveURL(dashboard.failedDeploymentsRedirectUrl);
    await page.goBack();

    const successfulDestroys = dashboard.getStaticsElementAtPosition(2);
    await expect(successfulDestroys).toBeVisible();
    await expect(successfulDestroys).toHaveText('Successful Destroys');
    expect(await dashboard.getValueOfStatistics(2)).toBe('1');
    const successfulDestroysValue = dashboard.getLocationOfStatisticElementAtPosition(2);
    await expect(await successfulDestroysValue).toHaveCSS('color', dashboard.successStaticColor, { timeout: 10000 });
    await successfulDestroys.click();
    await expect(page).toHaveURL(dashboard.successDestroysRedirectUrl);
    await page.goBack();

    const failedDestroys = dashboard.getStaticsElementAtPosition(3);
    await expect(failedDestroys).toBeVisible();
    await expect(failedDestroys).toHaveText('Failed Destroys');
    expect(await dashboard.getValueOfStatistics(3)).toBe('0');
    const failedDestroysValue = dashboard.getLocationOfStatisticElementAtPosition(3);
    await expect(await failedDestroysValue).toHaveCSS('color', dashboard.failureStaticColor, { timeout: 10000 });
    await failedDestroys.click();
    await expect(page).toHaveURL(dashboard.failedDestroysRedirectUrl);
    await page.goBack();
});

test('show error when dashboard service is not reachable', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    await loadAuthenticationErrorMock(page, serviceDetailsUrl);
    await page.waitForTimeout(2000); // wait for page to switch.
    await page.getByRole('button', { name: 'Retry Request' }).isEnabled();
    await expect(page.getByText('Unauthorized')).toBeVisible();
});

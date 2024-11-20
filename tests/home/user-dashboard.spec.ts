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
    expect(await dashboard.getValueOfStatics(0)).toBe('1');
    expect(await dashboard.getStaticsColorAtPosition(0)).toBe(dashboard.successStaticColor);
    await successfulDeployment.click();
    await expect(page).toHaveURL(dashboard.successDeploymentRedirectUrl);
    await page.goBack();

    const failedDeployments = dashboard.getStaticsElementAtPosition(1);
    await expect(failedDeployments).toBeVisible();
    await expect(failedDeployments).toHaveText('Failed Deployments');
    expect(await dashboard.getValueOfStatics(1)).toBe('1');
    expect(await dashboard.getStaticsColorAtPosition(1)).toBe(dashboard.failureStaticColor);
    await failedDeployments.click();
    await expect(page).toHaveURL(dashboard.failedDeploymentsRedirectUrl);
    await page.goBack();

    const successfulDestroys = dashboard.getStaticsElementAtPosition(2);
    await expect(successfulDestroys).toBeVisible();
    await expect(successfulDestroys).toHaveText('Successful Destroys');
    expect(await dashboard.getValueOfStatics(2)).toBe('1');
    expect(await dashboard.getStaticsColorAtPosition(2)).toBe(dashboard.successStaticColor);
    await successfulDestroys.click();
    await expect(page).toHaveURL(dashboard.successDestroysRedirectUrl);
    await page.goBack();

    const failedDestroys = dashboard.getStaticsElementAtPosition(3);
    await expect(failedDestroys).toBeVisible();
    await expect(failedDestroys).toHaveText('Failed Destroys');
    expect(await dashboard.getValueOfStatics(3)).toBe('0');
    expect(await dashboard.getStaticsColorAtPosition(3)).toBe(dashboard.failureStaticColor);
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

import { expect, test } from '@playwright/test';
import { isElementFullyVisibleInsideViewport } from '../utils/common/view-port-validation.ts';
import { loadConnectionRefusedMock } from '../utils/mocks/common-errors-mock.ts';
import { catalogServicesUrl } from '../utils/mocks/endpoints.ts';
import {
    mockDeployDetailsSuccessResponse,
    mockDeployFailedResponse,
    mockDeploySuccessResponse,
    mockDeployTaskStatusSuccessResponse,
    mockMyServicesSuccessResponse,
    mockRetryDeployFailedResponse,
    mockSelectAzsSuccessResponse,
    mockSelectPriceSuccessResponse,
    mockSelectServicesSuccessResponse,
    mockServicesSuccessResponse,
    mockVmResourceSuccessResponse,
} from '../utils/mocks/service-order-mock.ts';
import { HomePage } from '../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../utils/pages/LayoutHeaderPage.ts';
import { MyServicesPage } from '../utils/pages/MyServicesPage.ts';
import { OrderSubmitPage } from '../utils/pages/OrderSubmitPage.ts';
import { SelectServicePage } from '../utils/pages/SelectServicePage.ts';
import { ServiceOrderPage } from '../utils/pages/ServiceOrderPage.ts';

test('Submenu should load services data', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    await mockServicesSuccessResponse(page, 0);
    let apiCallCount = 0;
    page.on('request', (request) => {
        if (request.url().includes(catalogServicesUrl)) {
            apiCallCount++;
        }
    });
    const servicesPage = new ServiceOrderPage(page);
    await servicesPage.clickServicesButton();
    await page.waitForTimeout(2000);
    await servicesPage.clickComputeMenuItem();
    await page.waitForTimeout(2000);
    expect(apiCallCount, 'New API call must be done when submenu button is clicked.').toBe(1);
});

test('deploy service successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');

    await mockServicesSuccessResponse(page, 0);
    await mockSelectServicesSuccessResponse(page, 0);
    await mockSelectAzsSuccessResponse(page, 0);
    await mockSelectPriceSuccessResponse(page, 0);
    await mockDeploySuccessResponse(page, 0);
    await mockDeployTaskStatusSuccessResponse(page, 0);
    await mockDeployDetailsSuccessResponse(page, 0);
    await mockVmResourceSuccessResponse(page, 0);
    await mockMyServicesSuccessResponse(page, 0);

    const servicesPage = new ServiceOrderPage(page);
    await servicesPage.clickServicesButton();
    await page.waitForTimeout(1000);
    await servicesPage.clickComputeMenuItem();
    await page.waitForTimeout(1000);
    await servicesPage.clickComputeServiceButton();
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
        window.location.href = `/services/createService?serviceName=terraform-ecs&latestVersion=1.0.0#compute`;
    });

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/services\/createService\?serviceName=terraform-ecs&latestVersion=1.0.0#compute/);

    const selectServicePage = new SelectServicePage(page);
    await selectServicePage.selectNextButton();

    await page.evaluate(() => {
        window.location.href = `/services/createService/orderSubmit?serviceName=terraform-ecs&version=1.0.0#compute`;
    });

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(
        /.*\/services\/createService\/orderSubmit\?serviceName=terraform-ecs&version=1.0.0#compute/
    );
    const orderSubmitPage = new OrderSubmitPage(page);

    await orderSubmitPage.selectTerms();
    await orderSubmitPage.fillServiceName('testtesttest');

    await orderSubmitPage.clickDeployButton();
    await page.waitForTimeout(3000);
    const successResult = orderSubmitPage.successResult;
    await expect(successResult).toBeVisible();
    const successEndpointsResult = orderSubmitPage.successEndpointsDetailsLink;
    await expect(successEndpointsResult).toBeVisible();
    await page.waitForTimeout(1000);

    await orderSubmitPage.clickServiceId();
    await page.evaluate(() => {
        const url = '/myServices';
        window.history.pushState(
            { from: '/services/createService/orderSubmit', serviceIds: ['868326e9-3611-43d6-ad88-c15d514f3f57'] },
            '',
            url
        );
        window.dispatchEvent(new PopStateEvent('popstate'));
    });

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/myServices');

    const myServicesPage = new MyServicesPage(page);
    await expect(myServicesPage.getNameCellLocator()).toBeVisible();

    const nameCellText = await myServicesPage.getNameCell();
    expect(nameCellText).toBe('testDeploy');
});

test('deploy service failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');

    await mockServicesSuccessResponse(page, 0);
    await mockSelectServicesSuccessResponse(page, 0);
    await mockSelectAzsSuccessResponse(page, 0);
    await mockSelectPriceSuccessResponse(page, 0);
    await mockDeployFailedResponse(page, 0);
    await mockRetryDeployFailedResponse(page, 0);

    const servicesPage = new ServiceOrderPage(page);
    await servicesPage.clickServicesButton();
    await page.waitForTimeout(1000);
    await servicesPage.clickComputeMenuItem();
    await page.waitForTimeout(1000);
    await servicesPage.clickComputeServiceButton();
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
        const serviceName = 'terraform-ecs';
        const latestVersion = '1.0.0';
        const url = `/services/createService?serviceName=${serviceName}&latestVersion=${latestVersion}#compute`;
        window.location.href = url;
    });

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/services\/createService\?serviceName=terraform-ecs&latestVersion=1.0.0#compute/);

    const selectServicePage = new SelectServicePage(page);
    await selectServicePage.selectNextButton();

    await page.evaluate(() => {
        const serviceName = 'terraform-ecs';
        const version = '1.0.0';
        const url = `/services/createService/orderSubmit?serviceName=${serviceName}&version=${version}#compute`;
        window.location.href = url;
    });

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(
        /.*\/services\/createService\/orderSubmit\?serviceName=terraform-ecs&version=1.0.0#compute/
    );
    const orderSubmitPage = new OrderSubmitPage(page);

    await orderSubmitPage.selectTerms();
    await orderSubmitPage.fillServiceName('testtesttest');

    await orderSubmitPage.clickDeployButton();
    await page.waitForTimeout(3000);
    const backendErrorResult = orderSubmitPage.backendErrorAlert;
    await expect(backendErrorResult).toBeVisible();
    await orderSubmitPage.clickRetryRequestButton();
    await page.waitForTimeout(5000);
    const errorResult = orderSubmitPage.errorResult;
    await expect(errorResult).toBeVisible();
});

test('show error alert when backend is not reachable', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    await loadConnectionRefusedMock(page, catalogServicesUrl);
    const servicesPage = new ServiceOrderPage(page);
    await servicesPage.clickServicesButton();
    await servicesPage.clickComputeMenuItem();
    await page.waitForTimeout(3000);
    const errorAlert = servicesPage.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(await isElementFullyVisibleInsideViewport(page, errorAlert), 'Error alert must be fully visible.').toBe(
        true
    );
    await mockServicesSuccessResponse(page, 2000);
    await servicesPage.clickRetryRequestButton();
    await expect(errorAlert, 'Alert should be removed during and after successful reload').not.toBeVisible();
});

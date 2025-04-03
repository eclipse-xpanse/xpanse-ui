import { expect, test } from '@playwright/test';
import {
    mockRegisterErrorResponse,
    mockRegisterSuccessResponse,
    mockServiceTemplateDetailSuccessResponse,
    mockServiceTemplatesSuccessResponse,
} from '../../utils/mocks/service-register-mock.ts';
import { HomePage } from '../../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../../utils/pages/LayoutHeaderPage.ts';
import { ServiceRegisterPage } from '../../utils/pages/ServiceRegisterPage.ts';

test('service details show successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    const registerPage = new ServiceRegisterPage(page);
    await registerPage.clickRegisterPanelMenuItem();
    await page.waitForTimeout(1000);
    await registerPage.clickUploadFileButton();
    await page.waitForTimeout(1000);

    const serviceProvider = registerPage.getServiceProvider;
    await expect(serviceProvider).toBeVisible();
    const serviceHostingOptions = registerPage.getServiceHostingOptions;
    await expect(serviceHostingOptions).toBeVisible();
    const availableRegions = registerPage.getAvailableRegions;
    await expect(availableRegions).toBeVisible();
    const deploymentInformation = registerPage.getDeploymentInformation;
    await expect(deploymentInformation).toBeVisible();
    const flavors = registerPage.getFlavors;
    await expect(flavors).toBeVisible();
});

test('service register successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockRegisterSuccessResponse(page, 0);
    await mockServiceTemplateDetailSuccessResponse(page, 0);
    await mockServiceTemplatesSuccessResponse(page, 0);

    const registerPage = new ServiceRegisterPage(page);
    await registerPage.clickRegisterPanelMenuItem();
    await page.waitForTimeout(1000);
    await registerPage.clickUploadFileButton();
    await page.waitForTimeout(1000);
    await registerPage.clickRegisterButton();
    await page.waitForTimeout(1000);

    const successResult = registerPage.successAlert;
    await expect(successResult).toBeVisible();
    const serviceTemplateIdResult = registerPage.getServiceTemplateId;
    await expect(serviceTemplateIdResult).toBeVisible();
});

test('service register failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockRegisterErrorResponse(page, 0);
    const registerPage = new ServiceRegisterPage(page);
    await registerPage.clickRegisterPanelMenuItem();
    await page.waitForTimeout(1000);
    await registerPage.clickUploadFileButton();
    await page.waitForTimeout(1000);
    await registerPage.clickRegisterButton();
    await page.waitForTimeout(1000);

    const backendErrorResult = registerPage.backendErrorAlert;
    await expect(backendErrorResult).toBeVisible();
    await registerPage.clickRetryRequestButton();
    await page.waitForTimeout(5000);
    const errorResult = registerPage.errorAlert;
    await expect(errorResult).toBeVisible();

    await mockRegisterSuccessResponse(page, 0);
    await mockServiceTemplateDetailSuccessResponse(page, 0);
    await mockServiceTemplatesSuccessResponse(page, 0);
    await registerPage.clickUpdateNewFileButton();
    await registerPage.clickUploadFileButton();
    await page.waitForTimeout(1000);
    await registerPage.clickRegisterButton();
    await page.waitForTimeout(1000);
    const successResult = registerPage.successAlert;
    await expect(successResult).toBeVisible();
    const serviceTemplateIdResult = registerPage.getServiceTemplateId;
    await expect(serviceTemplateIdResult).toBeVisible();
});

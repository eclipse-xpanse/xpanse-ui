import { expect, test } from '@playwright/test';
import {
    mockCancelServiceFailedResponse,
    mockCancelServiceSuccessResponse,
    mockDeleteServiceFailedResponse,
    mockDeleteServiceSuccessResponse,
    mockIsvServicesResponse,
    mockMiddlewareServiceDetailSuccessResponse,
    mockMiddlewareServicePoliciesSuccessResponse,
    mockMiddlewareServiceRequestsCancelSuccessResponse,
    mockMiddlewareServiceRequestsReviewedSuccessResponse,
    mockMiddlewareServiceRequestsSuccessResponse,
    mockMiddlewareServiceRequestsUnpublishSuccessResponse,
    mockMiddlewareServiceReviewedCancelSuccessResponse,
    mockMiddlewareServiceReviewedSuccessResponse,
    mockMiddlewareServiceReviewSuccessResponse,
    mockMiddlewareServiceTemplatesCancelSuccessResponse,
    mockMiddlewareServiceTemplatesReviewedSuccessResponse,
    mockMiddlewareServiceTemplatesSuccessResponse,
    mockMiddlewareServiceTemplatesUnpublishSuccessResponse,
    mockRepublishServiceFailedResponse,
    mockRepublishServiceSuccessResponse,
    mockServiceTemplateReviewedSuccessResponse,
    mockServiceTemplateSuccessResponse,
    mockServiceTemplateUnpublishSuccessResponse,
    mockUnpublishServiceFailedResponse,
    mockUnpublishServiceSuccessResponse,
    mockUpdateServiceTemplateFailedResponse,
    mockUpdateServiceTemplateSuccessResponse,
} from '../../utils/mocks/service-catalog-mock.ts';
import { HomePage } from '../../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../../utils/pages/LayoutHeaderPage.ts';
import { ServiceCatalogPage } from '../../utils/pages/ServiceCatalogPage.ts';

test('service catalog details show successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    const serviceProvider = catalogPage.getServiceProvider;
    await expect(serviceProvider).toBeVisible();
    const serviceHostingOptions = catalogPage.getServiceHostingOptions;
    await expect(serviceHostingOptions).toBeVisible();
    const availableRegions = catalogPage.getAvailableRegions;
    await expect(availableRegions).toBeVisible();
    const deploymentInformation = catalogPage.getDeploymentInformation;
    await expect(deploymentInformation).toBeVisible();
    const flavors = catalogPage.getFlavors;
    await expect(flavors).toBeVisible();
    const configurationScripts = catalogPage.getConfigurationScripts;
    await expect(configurationScripts).toBeVisible();
    const serviceConfigurationParameters = catalogPage.getServiceConfigurationParameters;
    await expect(serviceConfigurationParameters).toBeVisible();
    const serviceActionScripts = catalogPage.getServiceActionScripts;
    await expect(serviceActionScripts).toBeVisible();
    const serviceActionParameters = catalogPage.getServiceActionParameters;
    await expect(serviceActionParameters).toBeVisible();
    const servicePolicies = catalogPage.getServicePolicies;
    await expect(servicePolicies).toBeVisible();
});

test('service update successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockUpdateServiceTemplateSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickUpdateButton();
    await catalogPage.clickUploadFileButton();
    await catalogPage.clickUpdateFileButton();
    const uploadSuccessAlert = catalogPage.uploadSuccessAlert;
    await expect(uploadSuccessAlert).toBeVisible();
    const serviceTemplateId = catalogPage.getServiceTemplateId;
    await expect(serviceTemplateId).toBeVisible();
});

test('service update failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockUpdateServiceTemplateFailedResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickUpdateButton();
    await catalogPage.clickUploadFileButton();
    await catalogPage.clickUpdateFileButton();
    const uploadFailedAlert = catalogPage.failedAlert;
    await expect(uploadFailedAlert).toBeVisible();
    await catalogPage.clickTryAgainButton();
    await page.waitForTimeout(5000);
    const errorResult = catalogPage.failedAlert;
    await expect(errorResult).toBeVisible();

    await mockUpdateServiceTemplateSuccessResponse(page, 0);
    await catalogPage.clickTryNewFileButton();
    await catalogPage.clickUploadFileButton();
    await page.waitForTimeout(1000);
    await catalogPage.clickUpdateFileButton();
    await page.waitForTimeout(5000);
    const successResult = catalogPage.uploadSuccessAlert;
    await expect(successResult).toBeVisible();
    const serviceTemplateIdResult = catalogPage.getServiceTemplateId;
    await expect(serviceTemplateIdResult).toBeVisible();
});

test('service unpublish successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateReviewedSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockUnpublishServiceSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickUnpublishButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const unpublishSuccessAlert = catalogPage.unpublishSuccessAlert;
    await expect(unpublishSuccessAlert).toBeVisible();
});

test('service unpublish failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateReviewedSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockUnpublishServiceFailedResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickUnpublishButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const unpublishFailedAlert = catalogPage.failedAlert;
    await expect(unpublishFailedAlert).toBeVisible();
    await catalogPage.clickRetryRequestButton();
    await page.waitForTimeout(5000);
    const errorResult = catalogPage.failedAlert;
    await expect(errorResult).toBeVisible();
});

test('service republish successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesUnpublishSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsUnpublishSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockRepublishServiceSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickRepublishButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const republishSuccessAlert = catalogPage.republishSuccessAlert;
    await expect(republishSuccessAlert).toBeVisible();
});

test('service republish failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesUnpublishSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsUnpublishSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockRepublishServiceFailedResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickRepublishButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const republishFailedAlert = catalogPage.failedAlert;
    await expect(republishFailedAlert).toBeVisible();
    await catalogPage.clickRetryRequestButton();
    await page.waitForTimeout(5000);
    const errorResult = catalogPage.failedAlert;
    await expect(errorResult).toBeVisible();
});

test('service delete successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockDeleteServiceSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickDeleteButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const deleteSuccessAlert = catalogPage.deleteSuccessAlert;
    await expect(deleteSuccessAlert).toBeVisible();
});

test('service delete failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockDeleteServiceFailedResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickCancelButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const deleteFailedAlert = catalogPage.failedAlert;
    await expect(deleteFailedAlert).toBeVisible();
    await catalogPage.clickRetryRequestButton();
    await page.waitForTimeout(5000);
    const errorResult = catalogPage.failedAlert;
    await expect(errorResult).toBeVisible();
});

test('show service history successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesUnpublishSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsUnpublishSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockRepublishServiceSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickHistoryButton();
    await page.waitForTimeout(1000);

    await catalogPage.clickRequestTemplateButton();
    const availableRegions = catalogPage.getAvailableRegions;
    await expect(availableRegions).toBeVisible();
    const deploymentInformation = catalogPage.getDeploymentInformation;
    await expect(deploymentInformation).toBeVisible();
    const flavors = catalogPage.getFlavors;
    await expect(flavors).toBeVisible();
    const configurationScripts = catalogPage.getConfigurationScripts;
    await expect(configurationScripts).toBeVisible();
    const serviceConfigurationParameters = catalogPage.getServiceConfigurationParameters;
    await expect(serviceConfigurationParameters).toBeVisible();
    const serviceActionScripts = catalogPage.getServiceActionScripts;
    await expect(serviceActionScripts).toBeVisible();
    const serviceActionParameters = catalogPage.getServiceActionParameters;
    await expect(serviceActionParameters).toBeVisible();
    const servicePolicies = catalogPage.getServicePolicies;
    await expect(servicePolicies).toBeVisible();
});

test('service cancel request pending successfully', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockCancelServiceSuccessResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickCancelButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const cancelSuccessAlert = catalogPage.cancelSuccessAlert;
    await expect(cancelSuccessAlert).toBeVisible();
});

test('service cancel request pending failed', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');

    await mockServiceTemplateUnpublishSuccessResponse(page, 0);
    await mockIsvServicesResponse(page, 0);
    await mockMiddlewareServiceTemplatesCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceRequestsCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceReviewedCancelSuccessResponse(page, 0);
    await mockMiddlewareServiceDetailSuccessResponse(page, 0);
    await mockMiddlewareServicePoliciesSuccessResponse(page, 0);
    await mockCancelServiceFailedResponse(page, 0);

    const catalogPage = new ServiceCatalogPage(page);
    await catalogPage.clickServiceCatalogMenu();
    await catalogPage.clickMiddlewareMenuItem();
    await page.waitForTimeout(1000);

    await catalogPage.clickCancelButton();
    await catalogPage.clickConfirmButton();
    await page.waitForTimeout(1000);

    const cancelFailedAlert = catalogPage.failedAlert;
    await expect(cancelFailedAlert).toBeVisible();
    await catalogPage.clickRetryRequestButton();
    await page.waitForTimeout(5000);
    const errorResult = catalogPage.failedAlert;
    await expect(errorResult).toBeVisible();
});

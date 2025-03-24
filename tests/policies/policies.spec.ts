import { expect, test } from '@playwright/test';
import { isElementFullyVisibleInsideViewport } from '../utils/common/view-port-validation.ts';
import { loadConnectionRefusedMock } from '../utils/mocks/common-errors-mock.ts';
import { mockCredentialsCspSuccessResponse } from '../utils/mocks/credentials-mock.ts';
import { policiesUrl, policyDeleteUrl } from '../utils/mocks/endpoints.ts';
import {
    mockPoliciesSuccessResponse,
    mockPolicyDeleteErrorResponse,
    mockPolicyDeleteSuccessResponse,
    mockPolicyPostErrorResponse,
    mockPolicyPostSuccessResponse,
    mockPolicyPutErrorResponse,
    mockPolicyPutSuccessResponse,
} from '../utils/mocks/policies-mock.ts';
import { AddPolicyPage } from '../utils/pages/AddPolicyPage.ts';
import { HomePage } from '../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../utils/pages/LayoutHeaderPage.ts';
import { PoliciesPage } from '../utils/pages/PoliciesPage.ts';
import { UpdatePolicyPage } from '../utils/pages/UpdatePolicyPage.ts';

test('Refresh button should reload policies data', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    await mockPoliciesSuccessResponse(page, 0);
    let apiCallCount = 0;
    page.on('request', (request) => {
        if (request.url().includes(policiesUrl)) {
            apiCallCount++;
        }
    });
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await page.waitForTimeout(2000);
    await policiesMenu.clickRefreshPoliciesButton();
    await page.waitForTimeout(2000);
    expect(apiCallCount, 'New API call must be done when refresh button is clicked.').toBe(2);
});

test('add policy successfully', async ({ page, baseURL }) => {
    await mockPoliciesSuccessResponse(page, 0);
    await mockCredentialsCspSuccessResponse(page, 0);
    await mockPolicyPostSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await policiesMenu.clickAddPoliciesButton();

    const addPolicyPage = new AddPolicyPage(page);
    await addPolicyPage.selectCsp();
    await addPolicyPage.selectEnabled();
    await addPolicyPage.uploadPolicy();
    await addPolicyPage.clickSubmitButton();
    const successAlert = addPolicyPage.successAlert;
    await expect(successAlert).toBeVisible();
    expect(
        await addPolicyPage.isElementFullyVisibleInsideViewport(successAlert),
        'Success alert must be fully visible.'
    ).toBe(true);
});

test('add policy failed', async ({ page, baseURL }) => {
    await mockPoliciesSuccessResponse(page, 0);
    await mockCredentialsCspSuccessResponse(page, 0);
    await mockPolicyPostErrorResponse(page, 2000, 500, 'Internal Server Error');
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await policiesMenu.clickAddPoliciesButton();

    const addPolicyPage = new AddPolicyPage(page);
    await addPolicyPage.selectCsp();
    await addPolicyPage.selectEnabled();
    await addPolicyPage.uploadPolicy();
    await addPolicyPage.clickSubmitButton();
    const errorAlert = addPolicyPage.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(
        await addPolicyPage.isElementFullyVisibleInsideViewport(errorAlert),
        'Failed alert must be fully visible.'
    ).toBe(true);
});

test('update policy successfully', async ({ page, baseURL }) => {
    await mockPoliciesSuccessResponse(page, 0);
    await mockCredentialsCspSuccessResponse(page, 0);
    await mockPolicyPutSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await policiesMenu.clickUpdatePoliciesButton();

    const updatePolicyPage = new UpdatePolicyPage(page);
    await updatePolicyPage.selectEnabled();
    await updatePolicyPage.uploadPolicy();
    await updatePolicyPage.clickSubmitButton();
    const successAlert = updatePolicyPage.successAlert;
    await expect(successAlert).toBeVisible();
    expect(
        await updatePolicyPage.isElementFullyVisibleInsideViewport(successAlert),
        'Success alert must be fully visible.'
    ).toBe(true);
});

test('update policy failed', async ({ page, baseURL }) => {
    await mockPoliciesSuccessResponse(page, 0);
    await mockCredentialsCspSuccessResponse(page, 0);
    await mockPolicyPutErrorResponse(page, 2000, 500, 'Internal Server Error');
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await policiesMenu.clickUpdatePoliciesButton();

    const updatePolicyPage = new UpdatePolicyPage(page);
    await updatePolicyPage.selectEnabled();
    await updatePolicyPage.uploadPolicy();
    await updatePolicyPage.clickSubmitButton();
    const errorAlert = updatePolicyPage.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(
        await updatePolicyPage.isElementFullyVisibleInsideViewport(errorAlert),
        'Failed alert must be fully visible.'
    ).toBe(true);
});

test('delete policy successfully', async ({ page, baseURL }) => {
    await mockPoliciesSuccessResponse(page, 0);
    await mockPolicyDeleteSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await page.waitForTimeout(3000);

    let deleteRequestCaptured = false;
    page.on('request', (request) => {
        if (request.url().includes(policyDeleteUrl) && request.method() === 'DELETE') {
            deleteRequestCaptured = true;
        }
    });

    await policiesMenu.clickDeletePoliciesButton();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(deleteRequestCaptured, 'Delete request should be captured').toBe(true);
    const successAlert = policiesMenu.successAlert;
    await expect(successAlert).toBeVisible();
    expect(
        await policiesMenu.isElementFullyVisibleInsideViewport(successAlert),
        'Success alert must be fully visible.'
    ).toBe(true);
});

test('delete policy failed', async ({ page, baseURL }) => {
    await mockPoliciesSuccessResponse(page, 0);
    await mockPolicyDeleteErrorResponse(page, 2000, 500, 'Internal Server Error');
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await page.waitForTimeout(3000);

    let deleteRequestCaptured = false;
    page.on('request', (request) => {
        if (request.url().includes(policyDeleteUrl) && request.method() === 'DELETE') {
            deleteRequestCaptured = true;
        }
    });

    await policiesMenu.clickDeletePoliciesButton();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(deleteRequestCaptured, 'Delete request should be captured').toBe(true);
    const errorAlert = policiesMenu.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(
        await policiesMenu.isElementFullyVisibleInsideViewport(errorAlert),
        'Failed alert must be fully visible.'
    ).toBe(true);
});

test('show error alert when backend is not reachable', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('user');
    await loadConnectionRefusedMock(page, policiesUrl);
    const policiesMenu = new PoliciesPage(page);
    await policiesMenu.clickPoliciesMenuItem();
    await page.waitForTimeout(3000);
    const errorAlert = policiesMenu.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(await isElementFullyVisibleInsideViewport(page, errorAlert), 'Error alert must be fully visible.').toBe(
        true
    );
    await mockPoliciesSuccessResponse(page, 2000);
    await policiesMenu.clickRefreshPoliciesButton();
    await expect(errorAlert, 'Alert should be removed during and after successful reload').not.toBeVisible();
});

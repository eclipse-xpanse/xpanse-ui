import { expect, test } from '@playwright/test';
import { isElementFullyVisibleInsideViewport } from '../utils/common/view-port-validation.ts';
import { loadConnectionRefusedMock } from '../utils/mocks/common-errors-mock.ts';
import {
    mockCredentialsCapabilitiesSuccessResponse,
    mockCredentialsCspSuccessResponse,
    mockCredentialsDeleteErrorResponse,
    mockCredentialsDeleteSuccessResponse,
    mockCredentialsPostErrorResponse,
    mockCredentialsPutErrorResponse,
    mockCredentialsSiteSuccessResponse,
    mockCredentialsSuccessResponse,
    mockCredentialsTypeSuccessResponse,
} from '../utils/mocks/credentials-mock.ts';
import { credentialsDeleteUrl, credentialsUrl } from '../utils/mocks/endpoints.ts';
import { AddCredentialPage } from '../utils/pages/AddCredentialPage.ts';
import { CredentialDetailsPage } from '../utils/pages/CredentialDetailsPage.ts';
import { CredentialsPage } from '../utils/pages/CredentialsPage.ts';
import { HomePage } from '../utils/pages/HomePage.ts';
import { LayoutHeaderPage } from '../utils/pages/LayoutHeaderPage.ts';
import { UpdateCredentialPage } from '../utils/pages/UpdateCredentialPage.ts';

test('Refresh button should reload credentials data', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    await mockCredentialsSuccessResponse(page, 0);
    let apiCallCount = 0;
    page.on('request', (request) => {
        if (request.url().includes(credentialsUrl)) {
            apiCallCount++;
        }
    });
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await page.waitForTimeout(2000);
    await credentialsMenu.clickRefreshCredentialsButton();
    await page.waitForTimeout(2000);
    expect(apiCallCount, 'New API call must be done when refresh button is clicked.').toBe(2);
});

test('add credentials successfully', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    await mockCredentialsCspSuccessResponse(page, 0);
    await mockCredentialsSiteSuccessResponse(page, 0);
    await mockCredentialsTypeSuccessResponse(page, 0);
    await mockCredentialsCapabilitiesSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await credentialsMenu.clickAddCredentialsButton();

    const addCredentialPage = new AddCredentialPage(page);
    await addCredentialPage.selectCsp();
    await addCredentialPage.selectSite();
    await addCredentialPage.selectCredentialType();
    await addCredentialPage.selectCredentialName();
    await addCredentialPage.fillTimeToLive(3600);
    await addCredentialPage.fillVariable('HW_ACCESS_KEY', 'test111');
    await addCredentialPage.fillVariable('HW_SECRET_KEY', 'test222');
    await addCredentialPage.clickAddButton();
    const successAlert = addCredentialPage.successAlert;
    await expect(successAlert).toBeVisible();
    expect(
        await addCredentialPage.isElementFullyVisibleInsideViewport(successAlert),
        'Success alert must be fully visible.'
    ).toBe(true);
});

test('add credentials failed', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    await mockCredentialsCspSuccessResponse(page, 0);
    await mockCredentialsSiteSuccessResponse(page, 0);
    await mockCredentialsTypeSuccessResponse(page, 0);
    await mockCredentialsCapabilitiesSuccessResponse(page, 0);
    await mockCredentialsPostErrorResponse(page, 2000, 500, 'Internal Server Error');

    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await credentialsMenu.clickAddCredentialsButton();

    const addCredentialPage = new AddCredentialPage(page);
    await addCredentialPage.selectCsp();
    await addCredentialPage.selectSite();
    await addCredentialPage.selectCredentialType();
    await addCredentialPage.selectCredentialName();
    await addCredentialPage.fillTimeToLive(3600);
    await addCredentialPage.fillVariable('HW_ACCESS_KEY', 'test111');
    await addCredentialPage.fillVariable('HW_SECRET_KEY', 'test222');
    await addCredentialPage.clickAddButton();

    const errorAlert = addCredentialPage.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(
        await addCredentialPage.isElementFullyVisibleInsideViewport(errorAlert),
        'Error alert must be fully visible.'
    ).toBe(true);
});

test('show credential details', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await page.waitForTimeout(3000);
    await credentialsMenu.clickDetailsCredentialsButton();

    const credentialDetailsPage = new CredentialDetailsPage(page);
    const nameCellText = await credentialDetailsPage.getNameCell();
    expect(nameCellText, 'Name cell text must match expected value.').toBe('HW_ACCESS_KEY');
});

test('update credential successfully', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await credentialsMenu.clickUpdateCredentialsButton();

    const updateCredentialPage = new UpdateCredentialPage(page);
    await updateCredentialPage.fillTimeToLive(3600);
    await updateCredentialPage.fillVariable('HW_ACCESS_KEY', 'test111');
    await updateCredentialPage.fillVariable('HW_SECRET_KEY', 'test222');
    await updateCredentialPage.clickUpdateButton();
    const successAlert = updateCredentialPage.successAlert;
    await expect(successAlert).toBeVisible();
    expect(
        await updateCredentialPage.isElementFullyVisibleInsideViewport(successAlert),
        'Success alert must be fully visible.'
    ).toBe(true);
});

test('update credential failed', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await credentialsMenu.clickUpdateCredentialsButton();

    await mockCredentialsPutErrorResponse(page, 2000, 500, 'Internal Server Error');

    const updateCredentialPage = new UpdateCredentialPage(page);
    await updateCredentialPage.fillTimeToLive(3600);
    await updateCredentialPage.fillVariable('HW_ACCESS_KEY', 'test111');
    await updateCredentialPage.fillVariable('HW_SECRET_KEY', 'test222');
    await updateCredentialPage.clickUpdateButton();
    const errorAlert = updateCredentialPage.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(
        await updateCredentialPage.isElementFullyVisibleInsideViewport(errorAlert),
        'Error alert must be fully visible.'
    ).toBe(true);
});

test('delete credential successfully', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    await mockCredentialsDeleteSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await page.waitForTimeout(3000);

    let deleteRequestCaptured = false;
    page.on('request', (request) => {
        if (request.url().includes(credentialsDeleteUrl) && request.method() === 'DELETE') {
            deleteRequestCaptured = true;
        }
    });

    await credentialsMenu.clickDeleteCredentialsButton();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(deleteRequestCaptured, 'Delete request should be captured').toBe(true);
    const successAlert = credentialsMenu.successAlert;
    await expect(successAlert).toBeVisible();
    expect(
        await credentialsMenu.isElementFullyVisibleInsideViewport(successAlert),
        'Success alert must be fully visible.'
    ).toBe(true);
});

test('delete credential failed', async ({ page, baseURL }) => {
    await mockCredentialsSuccessResponse(page, 0);
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await page.waitForTimeout(3000);

    let deleteRequestCaptured = false;
    page.on('request', (request) => {
        if (request.url().includes(credentialsDeleteUrl) && request.method() === 'DELETE') {
            deleteRequestCaptured = true;
        }
    });
    await mockCredentialsDeleteErrorResponse(page, 2000, 500, 'Internal Server Error');

    await credentialsMenu.clickDeleteCredentialsButton();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(deleteRequestCaptured, 'Delete request should be captured').toBe(true);
    const errorAlert = credentialsMenu.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(
        await credentialsMenu.isElementFullyVisibleInsideViewport(errorAlert),
        'Failed alert must be fully visible.'
    ).toBe(true);
});

test('show error alert when backend is not reachable', async ({ page, baseURL }) => {
    const homePage = new HomePage(page, baseURL);
    await homePage.openHomePage();
    const layoutHeader = new LayoutHeaderPage(page);
    await layoutHeader.switchUserRole('isv');
    await loadConnectionRefusedMock(page, credentialsUrl);
    const credentialsMenu = new CredentialsPage(page);
    await credentialsMenu.clickCredentialsMenuItem();
    await page.waitForTimeout(3000);
    await credentialsMenu.clickRefreshCredentialsButton();
    const errorAlert = credentialsMenu.backendErrorAlert;
    await expect(errorAlert).toBeVisible();
    expect(await isElementFullyVisibleInsideViewport(page, errorAlert), 'Error alert must be fully visible.').toBe(
        true
    );
    await mockCredentialsSuccessResponse(page, 2000);
    await credentialsMenu.clickRefreshCredentialsButton();
    await expect(errorAlert, 'Alert should be removed during and after successful reload').not.toBeVisible();
});

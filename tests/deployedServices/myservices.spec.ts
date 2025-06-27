import { expect, test } from '@playwright/test';
import { myServicesRoute } from '../../src/components/utils/constants.tsx';
import { mockServiceDetailsSuccessResponse } from '../utils/mocks/service-details-mock';
import { HomePage } from '../utils/pages/HomePage';
import { LayoutHeaderPage } from '../utils/pages/LayoutHeaderPage';

test.describe('MyServices Page', () => {
    let homePage: HomePage;
    let layoutHeaderPage: LayoutHeaderPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page, process.env.BASE_URL);
        layoutHeaderPage = new LayoutHeaderPage(page);
        await homePage.openHomePage();
    });

    test('should navigate to MyServices page after switching to user role', async ({ page }) => {
        await test.step('Switch to user role', async () => {
            await layoutHeaderPage.switchUserRole('user');
        });

        await test.step('Navigate to MyServices page', async () => {
            await page.getByRole('menuitem', { name: 'cloud-server MyServices' }).click();
            await expect(page).toHaveURL(myServicesRoute);
        });
    });

    test('should show correct More options for deployment failed service', async ({ page }) => {
        // Setup mock response for service details
        await mockServiceDetailsSuccessResponse(page, 0);

        await test.step('Switch to user role and navigate to MyServices', async () => {
            await page.locator('a').filter({ hasText: 'test user' }).click();
            await page.getByRole('menuitem', { name: 'Switch Role' }).click();
            await page.getByRole('menuitem', { name: 'user' }).click();
            await page.getByRole('menuitem', { name: 'cloud-server MyServices' }).click();
            await expect(page).toHaveURL(myServicesRoute);
        });

        await test.step('Find and click More button for the deployment failed service', async () => {
            // Find the deployment failed service by its name from the mock data
            const failedServiceRow = page.getByRole('row').filter({ hasText: 'test-123' });
            await expect(failedServiceRow).toBeVisible();

            // Verify the status shows as deployment failed
            await expect(failedServiceRow.getByText('deployment failed')).toBeVisible();

            // Click the More button
            const moreButton = failedServiceRow.getByRole('button', { name: 'More' });
            await moreButton.click();

            // Verify dropdown menu is visible
            const dropdownMenu = page.locator('.ant-dropdown-menu');
            await expect(dropdownMenu).toBeVisible();

            // Verify specific options are enabled/disabled based on deployment failed status
            await test.step('Verify menu options for deployment failed service', async () => {
                // These options should be disabled for failed deployment
                await expect(dropdownMenu.getByRole('button', { name: 'edit modify parameters' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'copy port service' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'play-circle start' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'poweroff stop' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'sync restart' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'setting configuration' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'tool actions' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'redo recreate' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'close-circle destroy' })).toBeHidden();
                await expect(dropdownMenu.getByRole('button', { name: 'rise scale' })).toBeDisabled();

                // These options should be enabled for failed deployment
                await expect(dropdownMenu.getByRole('button', { name: 'delete purge' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'history order history' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'caret-right retry deployment' })).toBeEnabled();
            });

            // Close the dropdown by clicking outside
            await page.mouse.click(10, 10);
        });
    });

    test('should show correct More options for deployment successful service', async ({ page }) => {
        // Setup mock response for service details
        await mockServiceDetailsSuccessResponse(page, 0);

        await test.step('Switch to user role and navigate to MyServices', async () => {
            await page.locator('a').filter({ hasText: 'test user' }).click();
            await page.getByRole('menuitem', { name: 'Switch Role' }).click();
            await page.getByRole('menuitem', { name: 'user' }).click();
            await page.getByRole('menuitem', { name: 'cloud-server MyServices' }).click();
            await expect(page).toHaveURL(myServicesRoute);
        });

        await test.step('Find and click More button for the deployment succesful service', async () => {
            // Find the deployment failed service by its name from the mock data
            const successfulServiceRow = page.getByRole('row').filter({ hasText: 'dfdfdfd-success' });
            await expect(successfulServiceRow).toBeVisible();

            // Verify the status shows as deployment failed
            await expect(successfulServiceRow.getByText('deployment successful')).toBeVisible();

            // Click the More button
            const moreButton = successfulServiceRow.getByRole('button', { name: 'More' });
            await moreButton.click();

            // Verify dropdown menu is visible
            const dropdownMenu = page.locator('.ant-dropdown-menu');
            await expect(dropdownMenu).toBeVisible();

            // Verify specific options are enabled/disabled based on deployment failed status
            await test.step('Verify menu options for deployment failed service', async () => {
                // These options should be disabled for failed deployment
                await expect(dropdownMenu.getByRole('button', { name: 'edit modify parameters' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'copy port service' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'play-circle start' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'poweroff stop' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'sync restart' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'setting configuration' })).toBeDisabled();
                await expect(dropdownMenu.getByRole('button', { name: 'tool actions' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'redo recreate' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'close-circle destroy' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'rise scale' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'delete purge' })).toBeHidden();

                // These options should be enabled for failed deployment
                await expect(dropdownMenu.getByRole('button', { name: 'close-circle destroy' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'history order history' })).toBeEnabled();
                await expect(dropdownMenu.getByRole('button', { name: 'caret-right retry deployment' })).toBeHidden();
            });

            // Close the dropdown by clicking outside
            await page.mouse.click(10, 10);
        });
    });
});

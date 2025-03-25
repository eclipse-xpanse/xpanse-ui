import { Locator } from '@playwright/test';
import { Page } from 'playwright-core';

export class ServiceOrderPage {
    readonly page: Page;
    readonly servicesMenuItem: Locator;
    readonly computeMenuItem: Locator;
    readonly computeServiceButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.servicesMenuItem = this.page.getByRole('menu').getByText('Services', { exact: true });
        this.computeMenuItem = this.page.getByText('Compute');
        this.computeServiceButton = this.page
            .locator('div')
            .filter({ hasText: /^terraform-ecsThis is an enhanced compute services by ISV-A\.Service Vendor: ISV-A$/ })
            .first();
    }

    async clickServicesButton() {
        await this.servicesMenuItem.click();
    }

    async clickComputeMenuItem() {
        await this.computeMenuItem.click();
    }

    async clickComputeServiceButton() {
        await this.computeServiceButton.click();
    }

    async clickRetryRequestButton() {
        await this.page.getByRole('button', { name: 'Retry Request' }).click();
    }

    get backendErrorAlert() {
        return this.page.getByRole('alert');
    }
}

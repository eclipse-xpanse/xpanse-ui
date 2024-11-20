import { Locator } from '@playwright/test';
import { Page } from 'playwright-core';

export class HealthCheckPage {
    readonly page: Page;
    readonly healthCheckMenuItem: Locator;
    readonly refreshHealthCheckButton: Locator;
    readonly backendErrorAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.healthCheckMenuItem = this.page.getByRole('link', { name: 'HealthCheck' });
        this.refreshHealthCheckButton = this.page.getByRole('button', { name: 'sync refresh' });
        this.backendErrorAlert = this.page.getByRole('alert');
    }

    async clickHealthCheckMenuItem() {
        await this.healthCheckMenuItem.click();
    }

    async clickRefreshHealthCheckButton() {
        await this.refreshHealthCheckButton.click();
    }
}

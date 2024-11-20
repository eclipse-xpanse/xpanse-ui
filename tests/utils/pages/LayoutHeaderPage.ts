import { type Locator, type Page } from '@playwright/test';
import { roles } from '../../../src/components/utils/constants.tsx';

export class LayoutHeaderPage {
    readonly page: Page;
    readonly userNameButton: Locator;
    readonly systemStatusLoadingButton: Locator;
    readonly systemStatusFailedButton: Locator;
    readonly systemStatusSuccessfulButton: Locator;
    readonly systemStatusGenericButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameButton = page.locator('a').filter({ hasText: 'test user' });
        this.systemStatusLoadingButton = page.getByRole('button', { name: 'loading System Status' });
        this.systemStatusFailedButton = page.getByRole('button', { name: 'close-circle System Status' });
        this.systemStatusSuccessfulButton = page.getByRole('button', { name: 'check-circle System Status' });
        this.systemStatusGenericButton = page.getByRole('button', { name: 'System Status' });
    }

    async reloadSystemStatus() {
        await this.systemStatusGenericButton.click();
    }

    async switchUserRole(userRole: roles) {
        await this.page.locator('a').filter({ hasText: 'test user' }).click();
        await this.page.getByText(userRole, { exact: true }).click();
    }
}

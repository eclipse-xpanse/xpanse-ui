import { Locator } from '@playwright/test';
import { Page } from 'playwright-core';

export class CredentialsPage {
    readonly page: Page;
    readonly credentialsMenuItem: Locator;
    readonly refreshCredentialsButton: Locator;
    readonly addCredentialsButton: Locator;
    readonly detailsCredentialsButton: Locator;
    readonly updateCredentialsButton: Locator;
    readonly deleteCredentialsButton: Locator;
    readonly backendErrorAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.credentialsMenuItem = this.page.getByRole('link', { name: 'Credentials' });
        this.refreshCredentialsButton = this.page.getByRole('button', { name: 'sync refresh' });
        this.addCredentialsButton = this.page.getByRole('button', { name: 'plus-circle Add' });
        this.detailsCredentialsButton = this.page.getByRole('button', { name: 'fullscreen Details' });
        this.updateCredentialsButton = this.page.getByRole('button', { name: 'info-circle Update' });
        this.deleteCredentialsButton = this.page.getByRole('button', { name: 'minus-circle Delete' });
        this.backendErrorAlert = this.page.getByRole('alert');
    }

    async clickCredentialsMenuItem() {
        await this.credentialsMenuItem.click();
    }

    async clickRefreshCredentialsButton() {
        await this.refreshCredentialsButton.click();
    }

    async clickAddCredentialsButton() {
        await this.addCredentialsButton.click();
    }

    async clickDetailsCredentialsButton() {
        await this.detailsCredentialsButton.click();
    }

    async clickUpdateCredentialsButton() {
        await this.updateCredentialsButton.click();
    }

    async clickDeleteCredentialsButton() {
        await this.deleteCredentialsButton.click();
    }

    get successAlert() {
        return this.page.getByText('Credentials Deleted Successfully.');
    }

    async isElementFullyVisibleInsideViewport(element: Locator): Promise<boolean> {
        const boundingBox = await element.boundingBox();
        if (!boundingBox) return false;

        const viewport = this.page.viewportSize();
        if (!viewport) return false;

        return (
            boundingBox.x >= 0 &&
            boundingBox.y >= 0 &&
            boundingBox.x + boundingBox.width <= viewport.width &&
            boundingBox.y + boundingBox.height <= viewport.height
        );
    }
}

import { Locator } from '@playwright/test';
import { Page } from 'playwright-core';

export class PoliciesPage {
    readonly page: Page;
    readonly policiesMenuItem: Locator;
    readonly refreshPoliciesButton: Locator;
    readonly addPoliciesButton: Locator;
    readonly updatePoliciesButton: Locator;
    readonly deletePoliciesButton: Locator;
    readonly backendErrorAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.policiesMenuItem = this.page.getByRole('link', { name: 'Policies' });
        this.refreshPoliciesButton = this.page.getByRole('button', { name: 'sync refresh' });
        this.addPoliciesButton = this.page.getByRole('button', { name: 'plus-circle Add' });
        this.updatePoliciesButton = this.page.getByRole('button', { name: 'edit Update' }).first();
        this.deletePoliciesButton = this.page.getByRole('button', { name: 'close-circle Delete' });
        this.backendErrorAlert = this.page.getByRole('alert');
    }

    async clickPoliciesMenuItem() {
        await this.policiesMenuItem.click();
    }

    async clickRefreshPoliciesButton() {
        await this.refreshPoliciesButton.click();
    }

    async clickAddPoliciesButton() {
        await this.addPoliciesButton.click();
    }

    async clickUpdatePoliciesButton() {
        await this.updatePoliciesButton.click();
    }

    async clickDeletePoliciesButton() {
        await this.deletePoliciesButton.click();
    }

    get successAlert() {
        return this.page.getByText('Policy deleted successfully');
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

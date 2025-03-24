import { Locator, Page } from '@playwright/test';

export class UpdatePolicyPage {
    private page: Page;
    readonly uploadButton: Locator;
    readonly fileInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.uploadButton = this.page.getByRole('button', { name: 'upload Upload File' });
        this.fileInput = this.page.locator('input[type="file"]');
    }

    async selectCsp() {
        const cspInput = this.page.getByLabel('Csp');
        await cspInput.waitFor({ state: 'visible', timeout: 10000 });
        await cspInput.click({ force: true });

        const firstOption = this.page.locator('.ant-select-item-option-content').first();
        await firstOption.waitFor({ state: 'visible', timeout: 10000 });
        await firstOption.click();
    }

    async selectEnabled() {
        await this.page.getByLabel('false').check();
    }

    async uploadPolicy() {
        await this.uploadButton.click();
        await this.fileInput.setInputFiles('./tests/utils/common/policies/test_policies.rego');
    }

    async clickSubmitButton() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    get successAlert() {
        return this.page.getByText('Policy updated successfully');
    }

    get backendErrorAlert() {
        return this.page.getByRole('alert');
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

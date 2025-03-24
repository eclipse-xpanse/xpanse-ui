import { Locator, Page } from '@playwright/test';

export class AddPolicyPage {
    private page: Page;
    readonly uploadButton: Locator;
    readonly fileInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.uploadButton = this.page.getByRole('button', { name: 'upload Upload File' });
        this.fileInput = this.page.locator('input[type="file"]');
    }

    async selectCsp() {
        await this.page.getByLabel('Csp').click();
        await this.page.locator('.ant-select-item-option-content').first().click();
    }

    async selectEnabled() {
        await this.page.getByLabel('true').check();
    }

    async uploadPolicy() {
        await this.uploadButton.click();
        await this.fileInput.setInputFiles('./tests/utils/common/policies/test_policies.rego');
    }

    async clickSubmitButton() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    get successAlert() {
        return this.page.getByText('Policy created successfully');
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

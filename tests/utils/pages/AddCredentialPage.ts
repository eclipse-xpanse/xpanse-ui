import { Locator, Page } from '@playwright/test';

export class AddCredentialPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectCsp() {
        await this.page.getByLabel('Csp').click();
        await this.page.locator('.ant-select-item-option-content').first().click();
    }

    async selectSite() {
        await this.page.getByLabel('Site').click();
        await this.page.getByTitle('Chinese Mainland').locator('div').click();
    }

    async selectCredentialType() {
        await this.page.getByLabel('Type').click();
        await this.page.getByTitle('variables').locator('div').click();
    }

    async selectCredentialName() {
        await this.page.getByLabel('Name').click();
        await this.page.getByTitle('AK_SK').locator('div').click();
    }

    async fillTimeToLive(timeToLive: number) {
        await this.page.fill('#timeToLive', timeToLive.toString());
    }

    async fillVariable(fieldName: string, value: string) {
        await this.page.locator(`#${fieldName}`).click();
        await this.page.locator(`#${fieldName}`).fill(value);
    }

    async clickAddButton() {
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    }

    get successAlert() {
        return this.page.getByText('Adding Credential Successful.');
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

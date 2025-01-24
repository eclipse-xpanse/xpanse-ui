import { Locator, Page } from '@playwright/test';

export class UpdateCredentialPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillTimeToLive(timeToLive: number) {
        await this.page.fill('#timeToLive', timeToLive.toString());
    }

    async fillVariable(fieldName: string, value: string) {
        await this.page
            .getByRole('row', { name: `* ${fieldName} eye-invisible` })
            .getByRole('textbox')
            .click();
        await this.page
            .getByRole('row', { name: `* ${fieldName} eye-invisible` })
            .getByRole('textbox')
            .fill(value);
    }

    async clickUpdateButton() {
        await this.page.getByRole('button', { name: 'Update', exact: true }).click();
    }

    get successAlert() {
        return this.page.getByText('Updating Credential Successful.');
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

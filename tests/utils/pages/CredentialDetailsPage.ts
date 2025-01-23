import { Page } from '@playwright/test';

export class CredentialDetailsPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getNameCell(): Promise<string> {
        const cellLocator = this.page.getByRole('cell', { name: 'HW_ACCESS_KEY' });
        await cellLocator.waitFor({ state: 'visible', timeout: 10000 });
        const cellText = await cellLocator.textContent();
        return cellText ?? '';
    }
}

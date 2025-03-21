import { Page } from '@playwright/test';

export class MyServicesPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getIdCell(): Promise<string> {
        const cellLocator = this.page.getByRole('cell', { name: '868326e9-3611-43d6-ad88-' });
        await cellLocator.waitFor({ state: 'visible', timeout: 5000 });
        const cellText = await cellLocator.textContent();
        return cellText ?? '';
    }
}

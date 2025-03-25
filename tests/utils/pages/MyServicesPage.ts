import { Locator, Page } from '@playwright/test';

export class MyServicesPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getNameCellLocator(): Locator {
        return this.page.getByRole('cell', { name: 'testDeploy' });
    }

    async getNameCell(): Promise<string> {
        const cellLocator = this.getNameCellLocator();
        await cellLocator.waitFor({ state: 'visible', timeout: 5000 });
        return (await cellLocator.textContent()) ?? '';
    }
}

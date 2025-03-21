import { Page } from '@playwright/test';

export class SelectServicePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectNextButton() {
        await this.page.getByRole('button', { name: 'Next' }).click();
    }
}

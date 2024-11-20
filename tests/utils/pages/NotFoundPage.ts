import { Locator } from '@playwright/test';
import { Page } from 'playwright-core';

export class NotFoundPage {
    readonly page: Page;
    readonly goBackToHomePageButton: Locator;
    readonly notFoundImage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.goBackToHomePageButton = page.getByRole('button', { name: 'Back Home' });
        this.notFoundImage = page.getByRole('img', { name: 'No Found' });
    }

    async goBackToHomePage() {
        await this.goBackToHomePageButton.click();
    }
}

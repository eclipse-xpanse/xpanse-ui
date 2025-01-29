import type { Locator, Page } from '@playwright/test';
import { homePageRoute } from '../../../src/components/utils/constants.tsx';

export class HomePage {
    readonly page: Page;
    readonly documentationWebsite: Locator;
    readonly configurationLanguageLink: Locator;
    readonly logoOnHomePage: Locator;
    readonly baseUrl: string;

    constructor(page: Page, baseUrl: string | undefined) {
        this.page = page;
        this.documentationWebsite = page.getByRole('link', { name: 'Getting started with Xpanse' });
        this.configurationLanguageLink = page.getByRole('link', { name: 'Xpanse Service Description Language' });
        this.logoOnHomePage = page.getByRole('link').first();
        this.baseUrl = baseUrl ?? 'http://localhost:3000';
    }

    async openHomePage() {
        await this.page.goto(homePageRoute);
    }

    getBaseUrl() {
        return this.baseUrl;
    }
}

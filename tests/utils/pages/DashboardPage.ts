import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly baseUrl: string;
    readonly serviceStaticLocator: Locator;
    readonly successStaticColor: string = 'rgb(63, 134, 0)';
    readonly failureStaticColor: string = 'rgb(207, 19, 34)';
    readonly successDeploymentRedirectUrl: string;
    readonly failedDeploymentsRedirectUrl: string;
    readonly successDestroysRedirectUrl: string;
    readonly failedDestroysRedirectUrl: string;

    constructor(page: Page, baseUrl: string | undefined) {
        this.page = page;
        this.baseUrl = baseUrl ?? 'http://localhost:3000';
        this.serviceStaticLocator = page.locator('.ant-statistic-title');
        this.successDeploymentRedirectUrl =
            this.baseUrl +
            '/myServices?serviceDeploymentState=deployment+successful&serviceDeploymentState=modification+successful';
        this.failedDeploymentsRedirectUrl =
            this.baseUrl +
            '/myServices?serviceDeploymentState=deployment+failed&serviceDeploymentState=modification+failed&serviceDeploymentState=rollback+failed';
        this.successDestroysRedirectUrl = this.baseUrl + '/myServices?serviceDeploymentState=destroy+successful';
        this.failedDestroysRedirectUrl = this.baseUrl + '/myServices?serviceDeploymentState=destroy+failed';
    }

    async getValueOfStatistics(position: number) {
        return (await this.getLocationOfStatisticElementAtPosition(position)) // descendent element selector
            .textContent();
    }

    getStaticsElementAtPosition(position: number) {
        return this.serviceStaticLocator.nth(position);
    }
    async getLocationOfStatisticElementAtPosition(position: number) {
        const element = this.serviceStaticLocator
            .nth(position)
            .locator('+.ant-statistic-content') // sibling element selector
            .locator(' .ant-statistic-content-value-int'); // descendent element selector
        await expect(element).toBeVisible();
        return element;
    }
}

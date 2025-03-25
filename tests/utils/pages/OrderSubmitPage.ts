import { Page } from '@playwright/test';

export class OrderSubmitPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectTerms() {
        await this.page.getByRole('checkbox', { name: 'I have read and agreed to the' }).check();
    }

    async fillServiceName(name: string) {
        await this.page.getByRole('textbox', { name: '* Name: Service Name' }).fill(name);
    }

    async clickDeployButton() {
        await this.page.getByRole('button', { name: 'Deploy' }).click();
    }

    async clickServiceId() {
        await this.page.getByText('Service ID: 868326e9-3611-').click();
    }

    async clickRetryRequestButton() {
        await this.page.getByRole('button', { name: 'Retry Request' }).click();
    }

    get successResult() {
        return this.page.getByText('Deployment Successful');
    }

    get successEndpointsResult() {
        return this.page.getByRole('heading', { name: 'Endpoint Information' });
    }

    get successEcsHostResult() {
        return this.page.getByText('ecs_host:');
    }

    get successEcsPublicIpResult() {
        return this.page.getByText('ecs_public_ip:');
    }

    get successAdminPasswdResult() {
        return this.page.getByText('admin_passwd:');
    }

    get backendErrorAlert() {
        return this.page.getByRole('alert');
    }

    get errorResult() {
        return this.page.getByText('Deployment Failed Exception');
    }
}

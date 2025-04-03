import { Locator } from '@playwright/test';
import path from 'path';
import { Page } from 'playwright-core';
import { computeYmlUrl } from '../mocks/endpoints.ts';
import { downloadFile, targetDir } from './DownloadYmlFile.ts';

const localFilePath = path.join(targetDir, 'HuaweiCloud-Compute-terraform-dev.yml');

export class ServiceRegisterPage {
    readonly page: Page;
    readonly registerPanelMenuItem: Locator;
    readonly uploadFileButton: Locator;
    readonly registerButton: Locator;
    readonly uploadNewFileButton: Locator;
    readonly retryRequestButton: Locator;
    readonly backendErrorAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerPanelMenuItem = this.page.getByRole('link', { name: 'Register Panel' });
        this.uploadFileButton = this.page.getByRole('button', { name: 'upload Upload File' });
        this.registerButton = this.page.getByRole('button', { name: 'cloud-upload Register' });
        this.uploadNewFileButton = this.page.getByRole('button', { name: 'Upload New File' });
        this.retryRequestButton = this.page.getByRole('button', { name: 'Retry Request' });
        this.backendErrorAlert = this.page.getByRole('alert').first();
    }

    async clickRegisterPanelMenuItem() {
        await this.registerPanelMenuItem.click();
    }

    async clickUploadFileButton() {
        await downloadFile(computeYmlUrl, localFilePath);
        await this.uploadFileButton.click();
        const fileInput = this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(localFilePath);
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async clickRetryRequestButton() {
        await this.retryRequestButton.click();
    }

    async clickUpdateNewFileButton() {
        await this.uploadNewFileButton.click();
    }

    get successAlert() {
        return this.page.getByText('Service terraform-ecs registration request submitted successfully');
    }

    get getServiceTemplateId() {
        return this.page.locator('text=ID - ');
    }

    get errorAlert() {
        return this.page.getByRole('alert').nth(0);
    }

    get getServiceProvider() {
        return this.page.getByText('Cloud Service Provider');
    }

    get getServiceHostingOptions() {
        return this.page.getByText('Service Hosted By');
    }

    get getAvailableRegions() {
        return this.page.getByRole('heading', { name: 'global Available Regions' });
    }

    get getDeploymentInformation() {
        return this.page.getByText('Deployment Information');
    }

    get getFlavors() {
        return this.page.getByRole('heading', { name: 'ordered-list Flavors' });
    }
}

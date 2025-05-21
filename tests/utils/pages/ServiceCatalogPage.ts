import { Locator } from '@playwright/test';
import path from 'path';
import { Page } from 'playwright-core';
import { middlewareYmlUrl } from '../mocks/endpoints.ts';
import { downloadFile, targetDir } from './DownloadYmlFile.ts';

const localFilePath = path.join(targetDir, 'HuaweiCloud-Kafka.yml');

export class ServiceCatalogPage {
    readonly page: Page;
    readonly serviceCatalogMenu: Locator;
    readonly middlewareMenuItem: Locator;
    readonly updateButton: Locator;
    readonly uploadFileButton: Locator;
    readonly updateFileButton: Locator;
    readonly tryAgainButton: Locator;
    readonly tryNewFileButton: Locator;
    readonly unpublishButton: Locator;
    readonly republishButton: Locator;
    readonly deleteButton: Locator;
    readonly historyButton: Locator;
    readonly historyRequestTemplateButton: Locator;
    readonly cancelButton: Locator;
    readonly backendErrorAlert: Locator;
    readonly confirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.serviceCatalogMenu = this.page.getByText('Catalog');
        this.middlewareMenuItem = this.page.getByText('Middleware');
        this.updateButton = this.page.getByRole('button', { name: 'edit Update' });
        this.uploadFileButton = this.page.getByRole('button', { name: 'upload Upload File' });
        this.updateFileButton = this.page.getByRole('button', { name: 'cloud-upload Update' });
        this.tryAgainButton = this.page.getByRole('button', { name: 'Try Again' });
        this.tryNewFileButton = this.page.getByRole('button', { name: 'Try New File' });
        this.unpublishButton = this.page.getByRole('button', { name: 'minus-circle Unpublish' });
        this.republishButton = this.page.getByRole('button', { name: 'plus-circle Republish' });
        this.deleteButton = this.page.getByRole('button', { name: 'delete Delete' });
        this.historyButton = this.page.getByRole('button', { name: 'history History' });
        this.historyRequestTemplateButton = this.page
            .getByRole('cell', { name: 'info-circle request template' })
            .first();
        this.cancelButton = this.page.getByRole('button', { name: 'close-circle Cancel' });
        this.backendErrorAlert = this.page.getByRole('alert').first();
        this.confirmButton = this.page.getByRole('button', { name: 'Yes' });
    }

    async clickServiceCatalogMenu() {
        await this.serviceCatalogMenu.click();
    }

    async clickMiddlewareMenuItem() {
        await this.middlewareMenuItem.click();
    }

    async clickUpdateButton() {
        await this.updateButton.click();
    }

    async clickUploadFileButton() {
        await downloadFile(middlewareYmlUrl, localFilePath);
        await this.uploadFileButton.click();
        const fileInput = this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(localFilePath);
    }

    async clickUpdateFileButton() {
        await this.updateFileButton.click();
    }

    async clickTryAgainButton() {
        await this.tryAgainButton.click();
    }

    async clickTryNewFileButton() {
        await this.tryNewFileButton.click();
    }

    async clickUnpublishButton() {
        await this.unpublishButton.click();
    }

    async clickConfirmButton() {
        await this.confirmButton.click();
    }

    async clickRepublishButton() {
        await this.republishButton.click();
    }

    async clickDeleteButton() {
        await this.deleteButton.click();
    }

    async clickHistoryButton() {
        await this.historyButton.click();
    }

    async clickRequestTemplateButton() {
        await this.historyRequestTemplateButton.click();
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }

    get successAlert() {
        return this.page.getByText('Service terraform-ecs registration request submitted successfully');
    }

    get getServiceProvider() {
        return this.page.getByText('Cloud Provider');
    }

    get getServiceHostingOptions() {
        return this.page.getByText('Service Hosting Options');
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

    get getConfigurationScripts() {
        return this.page.getByText('Configuration Scripts');
    }

    get getServiceConfigurationParameters() {
        return this.page.getByText('Service Configuration Parameters');
    }

    get getServiceActionScripts() {
        return this.page.getByText('Service Action Scripts');
    }

    get getServiceActionParameters() {
        return this.page.getByText('Service Action Parameters');
    }

    get getServicePolicies() {
        return this.page.getByRole('heading', { name: 'safety Service Policies' });
    }

    get uploadSuccessAlert() {
        return this.page.getByText('Service template Kafka-cluster update request submitted to review.');
    }

    get failedAlert() {
        return this.page.getByRole('alert').nth(0);
    }
    get unpublishSuccessAlert() {
        return this.page.getByText('Service Unpublished Successfully');
    }

    get republishSuccessAlert() {
        return this.page.getByText('Service republish request submitted successfully');
    }

    get cancelSuccessAlert() {
        return this.page.getByText('Pending service template request cancelled successfully.');
    }

    get deleteSuccessAlert() {
        return this.page.getByText('Service removed from the database completely.');
    }

    async clickRetryRequestButton() {
        await this.page.getByRole('button', { name: 'Retry Request' }).click();
    }

    get getServiceTemplateId() {
        return this.page.locator('text=ID - ');
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

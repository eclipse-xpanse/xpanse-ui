/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ServiceMigrationDetails = {
    /**
     * The ID of the service migration
     */
    migrationId: string;
    /**
     * The ID of the old service
     */
    oldServiceId: string;
    /**
     * The ID of the new service
     */
    newServiceId: string;
    /**
     * The status of the service migration
     */
    migrationStatus: ServiceMigrationDetails.migrationStatus;
    /**
     * Time of service migration.
     */
    createTime: string;
    /**
     * Time of update service migration.
     */
    lastModifiedTime: string;
};
export namespace ServiceMigrationDetails {
    /**
     * The status of the service migration
     */
    export enum migrationStatus {
        MIGRATION_STARTED = 'MigrationStarted',
        MIGRATION_COMPLETED = 'MigrationCompleted',
        MIGRATION_FAILED = 'MigrationFailed',
        DATA_EXPORT_STARTED = 'DataExportStarted',
        DATA_EXPORT_FAILED = 'DataExportFailed',
        DATA_EXPORT_COMPLETED = 'DataExportCompleted',
        DEPLOY_STARTED = 'DeployStarted',
        DEPLOY_FAILED = 'DeployFailed',
        DEPLOY_COMPLETED = 'DeployCompleted',
        DATA_IMPORT_STARTED = 'DataImportStarted',
        DATA_IMPORT_FAILED = 'DataImportFailed',
        DATA_IMPORT_COMPLETED = 'DataImportCompleted',
        DESTROY_STARTED = 'DestroyStarted',
        DESTROY_FAILED = 'DestroyFailed',
        DESTROY_COMPLETED = 'DestroyCompleted',
    }
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { MigrateRequest } from '../models/MigrateRequest';
import type { ServiceMigrationDetails } from '../models/ServiceMigrationDetails';
export class MigrationService {
    /**
     * Create a job to migrate the deployed service.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns string Accepted
     * @throws ApiError
     */
    public static migrate(requestBody: MigrateRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services/migration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
    /**
     * List all services migration by a user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param migrationId Id of the service migrate
     * @param newServiceId Id of the new service
     * @param oldServiceId Id of the old service
     * @param migrationStatus Status of the service migrate
     * @returns ServiceMigrationDetails OK
     * @throws ApiError
     */
    public static listServiceMigrations(
        migrationId?: string,
        newServiceId?: string,
        oldServiceId?: string,
        migrationStatus?:
            | 'MigrationStarted'
            | 'MigrationCompleted'
            | 'MigrationFailed'
            | 'DataExportStarted'
            | 'DataExportFailed'
            | 'DataExportCompleted'
            | 'DeployStarted'
            | 'DeployFailed'
            | 'DeployCompleted'
            | 'DataImportStarted'
            | 'DataImportFailed'
            | 'DataImportCompleted'
            | 'DestroyStarted'
            | 'DestroyFailed'
            | 'DestroyCompleted'
    ): CancelablePromise<Array<ServiceMigrationDetails>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/migrations',
            query: {
                migrationId: migrationId,
                newServiceId: newServiceId,
                oldServiceId: oldServiceId,
                migrationStatus: migrationStatus,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
    /**
     * Get migration records based on migration id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param migrationId Migration ID
     * @returns ServiceMigrationDetails OK
     * @throws ApiError
     */
    public static getMigrationOrderDetailsById(migrationId: string): CancelablePromise<ServiceMigrationDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/migration/{migrationId}',
            path: {
                migrationId: migrationId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
}

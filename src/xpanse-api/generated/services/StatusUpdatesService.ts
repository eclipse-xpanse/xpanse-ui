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
import type { DeploymentStatusUpdate } from '../models/DeploymentStatusUpdate';
export class StatusUpdatesService {
    /**
     * Long-polling method to get the latest service deployment or service update status.
     * @param id ID of the service
     * @param lastKnownServiceDeploymentState Last known service status to client. When provided, the service will wait for a configured period time until to see if there is a change to the last known state.
     * @returns DeploymentStatusUpdate OK
     * @throws ApiError
     */
    public static getLatestServiceDeploymentStatus(
        id: string,
        lastKnownServiceDeploymentState?:
            | 'deploying'
            | 'deployment successful'
            | 'deployment failed'
            | 'destroying'
            | 'destroy successful'
            | 'destroy failed'
            | 'manual cleanup required'
            | 'rollback failed'
            | 'modifying'
            | 'modification failed'
            | 'modification successful'
    ): CancelablePromise<DeploymentStatusUpdate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/service/deployment/status',
            query: {
                id: id,
                lastKnownServiceDeploymentState: lastKnownServiceDeploymentState,
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

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequest } from '../models/CreateRequest';
import type { Response } from '../models/Response';
import type { ServiceDetailVo } from '../models/ServiceDetailVo';
import type { ServiceVo } from '../models/ServiceVo';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceService {
    /**
     * Start a task to deploy registered service.<br>**Required role: admin or user**
     * @param requestBody
     * @returns string Accepted
     * @throws ApiError
     */
    public static deploy(requestBody: CreateRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services/deploy',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Lists all deployed services.<br>**Required role: admin or user**
     * @returns ServiceVo OK
     * @throws ApiError
     */
    public static listDeployedServices(): CancelablePromise<Array<ServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/deployed',
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * List all deployed services by a user.<br>**Required role: admin or user**
     * @param userName User who deployed the service
     * @returns ServiceVo OK
     * @throws ApiError
     */
    public static getDeployedServicesByUser(userName: string): CancelablePromise<Array<ServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/deployed/{userName}',
            path: {
                userName: userName,
            },
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Get deployed service details by id.<br>**Required role: admin or user**
     * @param id Task id of deployed service
     * @param userName User who deployed the service
     * @returns ServiceDetailVo OK
     * @throws ApiError
     */
    public static getDeployedServiceDetailsById(id: string, userName: string): CancelablePromise<ServiceDetailVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/deployed/{id}/details/{userName}',
            path: {
                id: id,
                userName: userName,
            },
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Start a task to destroy the deployed service using id.<br>**Required role: admin or user**
     * @param id
     * @returns Response Accepted
     * @throws ApiError
     */
    public static destroy(id: string): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/destroy/{id}',
            path: {
                id: id,
            },
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
                502: `Bad Gateway`,
            },
        });
    }
}

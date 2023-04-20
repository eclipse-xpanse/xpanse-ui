/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

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
     * Start a task to deploy registered service.
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
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * List the deployed services.
     * @returns ServiceVo OK
     * @throws ApiError
     */
    public static listDeployedServices(): CancelablePromise<Array<ServiceVo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/deployed',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get deployed service details by id.
     * @param id Task id of deployed service
     * @returns ServiceDetailVo OK
     * @throws ApiError
     */
    public static getDeployedServiceDetailsById(id: string): CancelablePromise<ServiceDetailVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/deployed/{id}/details',
            path: {
                id: id,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Start a task to destroy the deployed service using id.
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
                404: `Not Found`,
                422: `Unprocessable Entity`,
                500: `Internal Server Error`,
            },
        });
    }
}

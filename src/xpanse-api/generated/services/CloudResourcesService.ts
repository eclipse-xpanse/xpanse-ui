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
export class CloudResourcesService {
    /**
     * List existing cloud resource names with kind<br>Required role:<b> admin</b> or <b>user</b>
     * @param csp name of the cloud service provider
     * @param region name of he region
     * @param deployResourceKind kind of the CloudResource
     * @param serviceId id of the deployed service
     * @returns string OK
     * @throws ApiError
     */
    public static getExistingResourceNamesWithKind(
        csp:
            | 'HuaweiCloud'
            | 'FlexibleEngine'
            | 'OpenstackTestlab'
            | 'PlusServer'
            | 'RegioCloud'
            | 'AlibabaCloud'
            | 'aws'
            | 'azure'
            | 'GoogleCloudPlatform',
        region: string,
        deployResourceKind:
            | 'vm'
            | 'container'
            | 'publicIP'
            | 'vpc'
            | 'volume'
            | 'unknown'
            | 'security_group'
            | 'security_group_rule'
            | 'keypair'
            | 'subnet',
        serviceId?: string
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/csp/resources/{deployResourceKind}',
            path: {
                deployResourceKind: deployResourceKind,
            },
            query: {
                csp: csp,
                region: region,
                serviceId: serviceId,
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

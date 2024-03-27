/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeployedService } from '../models/DeployedService';
import type { DeployedServiceDetails } from '../models/DeployedServiceDetails';
import type { DeployRequest } from '../models/DeployRequest';
import type { Response } from '../models/Response';
import type { VendorHostedDeployedServiceDetails } from '../models/VendorHostedDeployedServiceDetails';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceService {
    /**
     * List all deployed services by a user.<br>Required role:<b> admin</b> or <b>user</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceState deployment state of the service
     * @returns DeployedService OK
     * @throws ApiError
     */
    public static listDeployedServices(
        categoryName?:
            | 'ai'
            | 'compute'
            | 'container'
            | 'storage'
            | 'network'
            | 'database'
            | 'mediaService'
            | 'security'
            | 'middleware'
            | 'others',
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        serviceName?: string,
        serviceVersion?: string,
        serviceState?:
            | 'deploying'
            | 'deployment successful'
            | 'deployment failed'
            | 'destroying'
            | 'destroy successful'
            | 'destroy failed'
            | 'migrating'
            | 'migration successful'
            | 'migration failed'
            | 'manual cleanup required'
            | 'rollback failed'
    ): CancelablePromise<Array<DeployedService>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceState: serviceState,
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
     * Start a task to deploy service using registered service template.<br>Required role:<b> admin</b> or <b>user</b>
     * @param requestBody
     * @returns string Accepted
     * @throws ApiError
     */
    public static deploy(requestBody: DeployRequest): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/xpanse/services',
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
     * List all deployed services by a user.<br>Required role:<b> isv</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceState deployment state of the service
     * @returns DeployedService OK
     * @throws ApiError
     */
    public static listDeployedServicesOfIsv(
        categoryName?:
            | 'ai'
            | 'compute'
            | 'container'
            | 'storage'
            | 'network'
            | 'database'
            | 'mediaService'
            | 'security'
            | 'middleware'
            | 'others',
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        serviceName?: string,
        serviceVersion?: string,
        serviceState?:
            | 'deploying'
            | 'deployment successful'
            | 'deployment failed'
            | 'destroying'
            | 'destroy successful'
            | 'destroy failed'
            | 'migrating'
            | 'migration successful'
            | 'migration failed'
            | 'manual cleanup required'
            | 'rollback failed'
    ): CancelablePromise<Array<DeployedService>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/isv',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceState: serviceState,
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
     * Get deployed service details by id.<br>Required role:<b> isv</b>
     * @param id Task id of deployed service
     * @returns DeployedServiceDetails OK
     * @throws ApiError
     */
    public static getServiceDetailsByIdForIsv(id: string): CancelablePromise<DeployedServiceDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/isv/details/vendor_hosted/{id}',
            path: {
                id: id,
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
     * List all deployed services details.<br>Required role:<b> admin</b> or <b>user</b>
     * @param categoryName category of the service
     * @param cspName name of the cloud service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     * @param serviceState deployment state of the service
     * @returns DeployedService OK
     * @throws ApiError
     */
    public static listDeployedServicesDetails(
        categoryName?:
            | 'ai'
            | 'compute'
            | 'container'
            | 'storage'
            | 'network'
            | 'database'
            | 'mediaService'
            | 'security'
            | 'middleware'
            | 'others',
        cspName?: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        serviceName?: string,
        serviceVersion?: string,
        serviceState?:
            | 'deploying'
            | 'deployment successful'
            | 'deployment failed'
            | 'destroying'
            | 'destroy successful'
            | 'destroy failed'
            | 'migrating'
            | 'migration successful'
            | 'migration failed'
            | 'manual cleanup required'
            | 'rollback failed'
    ): CancelablePromise<Array<DeployedService>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/details',
            query: {
                categoryName: categoryName,
                cspName: cspName,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceState: serviceState,
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
     * Get deployed service details by id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id Task id of deployed service
     * @returns VendorHostedDeployedServiceDetails OK
     * @throws ApiError
     */
    public static getVendorHostedServiceDetailsById(id: string): CancelablePromise<VendorHostedDeployedServiceDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/details/vendor_hosted/{id}',
            path: {
                id: id,
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
     * Get deployed service details by id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id Task id of deployed service
     * @returns DeployedServiceDetails OK
     * @throws ApiError
     */
    public static getSelfHostedServiceDetailsById(id: string): CancelablePromise<DeployedServiceDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/services/details/self_hosted/{id}',
            path: {
                id: id,
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
     * Get availability zones with csp and region.<br>Required role:<b> admin</b> or <b>user</b>
     * @param cspName name of the cloud service provider
     * @param regionName name of the region
     * @returns string OK
     * @throws ApiError
     */
    public static getAvailabilityZones(
        cspName: 'huawei' | 'flexibleEngine' | 'openstack' | 'scs' | 'alicloud' | 'aws' | 'azure' | 'google',
        regionName: string
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/xpanse/csp/region/azs',
            query: {
                cspName: cspName,
                regionName: regionName,
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
     * Start a task to destroy the deployed service using id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns Response Accepted
     * @throws ApiError
     */
    public static destroy(id: string): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/{id}',
            path: {
                id: id,
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
     * Start a task to purge the deployed service using id.<br>Required role:<b> admin</b> or <b>user</b>
     * @param id
     * @returns Response Accepted
     * @throws ApiError
     */
    public static purge(id: string): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/xpanse/services/purge/{id}',
            path: {
                id: id,
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

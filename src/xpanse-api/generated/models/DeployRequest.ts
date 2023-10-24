/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DeployRequest = {
    /**
     * The category of the service
     */
    category: DeployRequest.category;
    /**
     * The name of the service ordered.
     */
    serviceName: string;
    /**
     * Customer's name for the service. Used only for customer's reference.If not provided, this value will be auto-generated
     */
    customerServiceName?: string;
    /**
     * The version of service
     */
    version: string;
    /**
     * The region of the provider.
     */
    region: string;
    /**
     * The csp of the Service.
     */
    csp: DeployRequest.csp;
    /**
     * The flavor of the Service.
     */
    flavor: string;
    /**
     * The properties for the requested service
     */
    serviceRequestProperties?: Record<string, any>;
};

export namespace DeployRequest {
    /**
     * The category of the service
     */
    export enum category {
        AI = 'ai',
        COMPUTE = 'compute',
        CONTAINER = 'container',
        STORAGE = 'storage',
        NETWORK = 'network',
        DATABASE = 'database',
        MEDIA_SERVICE = 'mediaService',
        SECURITY = 'security',
        MIDDLEWARE = 'middleware',
        OTHERS = 'others',
    }

    /**
     * The csp of the Service.
     */
    export enum csp {
        HUAWEI = 'huawei',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        OPENSTACK = 'openstack',
        SCS = 'scs',
        ALICLOUD = 'alicloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE = 'google',
    }
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Region } from './Region';
export type MigrateRequest = {
    /**
     * The category of the service
     */
    category: MigrateRequest.category;
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
    region: Region;
    /**
     * The csp of the Service.
     */
    csp: MigrateRequest.csp;
    /**
     * The flavor of the Service.
     */
    flavor: string;
    /**
     * Defines which cloud service account is used for deploying cloud resources.
     */
    serviceHostingType: MigrateRequest.serviceHostingType;
    /**
     * The properties for the requested service
     */
    serviceRequestProperties?: Record<string, any>;
    /**
     * The id of the service to migrate
     */
    id: string;
};
export namespace MigrateRequest {
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
    /**
     * Defines which cloud service account is used for deploying cloud resources.
     */
    export enum serviceHostingType {
        SELF = 'self',
        SERVICE_VENDOR = 'service-vendor',
    }
}

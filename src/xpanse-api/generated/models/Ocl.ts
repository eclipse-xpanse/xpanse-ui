/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Billing } from './Billing';
import type { CloudServiceProvider } from './CloudServiceProvider';
import type { Deployment } from './Deployment';
import type { Flavors } from './Flavors';
import type { ServiceProviderContactDetails } from './ServiceProviderContactDetails';
export type Ocl = {
    /**
     * The catalog of the service
     */
    category: Ocl.category;
    /**
     * The version of the Ocl
     */
    version: string;
    /**
     * The name of the managed service
     */
    name: string;
    /**
     * The version of the managed service
     */
    serviceVersion: string;
    /**
     * The description of the managed service
     */
    description: string;
    /**
     * The namespace of the managed service
     */
    namespace: string;
    /**
     * The icon of the managed service
     */
    icon: string;
    cloudServiceProvider: CloudServiceProvider;
    deployment: Deployment;
    flavors: Flavors;
    billing: Billing;
    /**
     * Defines which cloud service account is used for deploying cloud resources.
     */
    serviceHostingType: Ocl.serviceHostingType;
    serviceProviderContactDetails: ServiceProviderContactDetails;
    /**
     * End user license agreement content of the service.
     */
    eula?: string;
};
export namespace Ocl {
    /**
     * The catalog of the service
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
     * Defines which cloud service account is used for deploying cloud resources.
     */
    export enum serviceHostingType {
        SELF = 'self',
        SERVICE_VENDOR = 'service-vendor',
    }
}

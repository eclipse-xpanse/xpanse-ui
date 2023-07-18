/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Billing } from './Billing';
import type { CloudServiceProvider } from './CloudServiceProvider';
import type { Deployment } from './Deployment';
import type { Flavor } from './Flavor';

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
    /**
     * The flavors of the managed service
     */
    flavors: Array<Flavor>;
    billing: Billing;
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
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Link } from './Link';
import type { Ocl } from './Ocl';

export type RegisteredServiceVo = {
    /**
     * ID of the registered service.
     */
    id: string;
    /**
     * Name of the registered service.
     */
    name: string;
    /**
     * Version of the registered service.
     */
    version: string;
    /**
     * Csp of the registered service.
     */
    csp: RegisteredServiceVo.csp;
    /**
     * Category of the registered service.
     */
    category: RegisteredServiceVo.category;
    ocl: Ocl;
    /**
     * createTime of the registered service.
     */
    createTime: string;
    /**
     * Last updateTime of the registered service.
     */
    lastModifiedTime: string;
    /**
     * State of service.
     */
    serviceState: RegisteredServiceVo.serviceState;
    links?: Array<Link>;
};

export namespace RegisteredServiceVo {
    /**
     * Csp of the registered service.
     */
    export enum csp {
        AWS = 'aws',
        AZURE = 'azure',
        ALICLOUD = 'alicloud',
        HUAWEI = 'huawei',
        OPENSTACK = 'openstack',
        FLEXIBLE_ENGINE = 'flexibleEngine',
    }

    /**
     * Category of the registered service.
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
     * State of service.
     */
    export enum serviceState {
        REGISTERED = 'REGISTERED',
        UPDATED = 'UPDATED',
        DEPLOYING = 'DEPLOYING',
        DEPLOY_SUCCESS = 'DEPLOY_SUCCESS',
        DEPLOY_FAILED = 'DEPLOY_FAILED',
        DESTROYING = 'DESTROYING',
        DESTROY_SUCCESS = 'DESTROY_SUCCESS',
        DESTROY_FAILED = 'DESTROY_FAILED',
    }
}

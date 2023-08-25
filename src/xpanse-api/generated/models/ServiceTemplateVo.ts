/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Link } from './Link';
import type { Ocl } from './Ocl';

export type ServiceTemplateVo = {
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
    csp: ServiceTemplateVo.csp;
    /**
     * Category of the registered service.
     */
    category: ServiceTemplateVo.category;
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
    serviceRegistrationState: ServiceTemplateVo.serviceRegistrationState;
    links?: Array<Link>;
};

export namespace ServiceTemplateVo {
    /**
     * Csp of the registered service.
     */
    export enum csp {
        HUAWEI = 'huawei',
        FLEXIBLE_ENGINE = 'flexibleEngine',
        OPENSTACK = 'openstack',
        ALICLOUD = 'alicloud',
        AWS = 'aws',
        AZURE = 'azure',
        GOOGLE = 'google',
        SCS = 'scs',
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
    export enum serviceRegistrationState {
        REGISTERED = 'registered',
        UPDATED = 'updated',
    }
}

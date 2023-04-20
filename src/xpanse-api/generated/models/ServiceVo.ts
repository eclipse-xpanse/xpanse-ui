/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ServiceVo = {
    /**
     * The ID of the service
     */
    id: string;
    /**
     * The catalog of the service
     */
    category: ServiceVo.category;
    /**
     * The name of the service
     */
    name: string;
    /**
     * Customer's name for the service. Used only for customer's reference.If not provided, this value will be auto-generated
     */
    customerServiceName?: string;
    /**
     * The version of the service
     */
    version: string;
    /**
     * The provider of the service
     */
    csp: ServiceVo.csp;
    /**
     * The flavor of the service
     */
    flavor?: string;
    /**
     * The state of the service
     */
    serviceState: ServiceVo.serviceState;
    /**
     * Time of register service.
     */
    createTime: string;
    /**
     * Time of update service.
     */
    lastModifiedTime: string;
};

export namespace ServiceVo {
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
     * The provider of the service
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
     * The state of the service
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

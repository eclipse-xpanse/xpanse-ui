/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateRequest } from './CreateRequest';
import type { DeployResource } from './DeployResource';

export type ServiceDetailVo = {
    /**
     * The ID of the service
     */
    id: string;
    /**
     * User who ordered the service
     */
    userName: string;
    /**
     * The catalog of the service
     */
    category: ServiceDetailVo.category;
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
    csp: ServiceDetailVo.csp;
    /**
     * The flavor of the service
     */
    flavor?: string;
    /**
     * The state of the service
     */
    serviceState: ServiceDetailVo.serviceState;
    /**
     * Time of register service.
     */
    createTime: string;
    /**
     * Time of update service.
     */
    lastModifiedTime: string;
    createRequest: CreateRequest;
    /**
     * The resource list of the deployed service.
     */
    deployResources?: Array<DeployResource>;
    /**
     * The properties of the deployed service.
     */
    deployedServiceProperties?: Record<string, string>;

    /**
     * The result message of the deployed service.
     */
    resultMessage?: string;
};

export namespace ServiceDetailVo {
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

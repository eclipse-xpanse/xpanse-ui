/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Billing } from './Billing';
import type { Deployment } from './Deployment';
import type { DeployVariable } from './DeployVariable';
import type { Flavor } from './Flavor';
import type { Link } from './Link';
import type { Region } from './Region';

export type ServiceTemplateDetailVo = {
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
    csp: ServiceTemplateDetailVo.csp;
    /**
     * Category of the registered service.
     */
    category: ServiceTemplateDetailVo.category;
    /**
     * Namespace of the user who registered service template.
     */
    namespace: string;
    /**
     * The regions of the Cloud Service Provider.
     */
    regions: Array<Region>;
    /**
     * The description of the available service.
     */
    description: string;
    /**
     * The icon of the available service.
     */
    icon: string;
    deployment: Deployment;
    /**
     * The variables for the deployment, which will be passed to the deployer.
     */
    variables: Array<DeployVariable>;
    /**
     * The flavors of the available service.
     */
    flavors: Array<Flavor>;
    billing: Billing;
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
    serviceRegistrationState: ServiceTemplateDetailVo.serviceRegistrationState;
    links?: Array<Link>;
};

export namespace ServiceTemplateDetailVo {
    /**
     * Csp of the registered service.
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

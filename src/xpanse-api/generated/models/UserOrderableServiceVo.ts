/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Billing } from './Billing';
import type { DeployVariable } from './DeployVariable';
import type { Flavor } from './Flavor';
import type { Link } from './Link';
import type { Region } from './Region';

export type UserOrderableServiceVo = {
    /**
     * The id of the available service.
     */
    id: string;
    /**
     * The catalog of the available service.
     */
    category: UserOrderableServiceVo.category;
    /**
     * The name of the available service.
     */
    name: string;
    /**
     * The version of the available service.
     */
    version: string;
    /**
     * The Cloud Service Provider of the available service.
     */
    csp: UserOrderableServiceVo.csp;
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
    /**
     * The variables for the deployment, which will be passed to the deployer.
     */
    variables: Array<DeployVariable>;
    /**
     * The flavors of the available service.
     */
    flavors: Array<Flavor>;
    billing: Billing;
    links?: Array<Link>;
};

export namespace UserOrderableServiceVo {
    /**
     * The catalog of the available service.
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
     * The Cloud Service Provider of the available service.
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

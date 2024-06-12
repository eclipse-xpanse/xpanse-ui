/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilityZoneConfig } from './AvailabilityZoneConfig';
import type { Billing } from './Billing';
import type { DeployVariable } from './DeployVariable';
import type { Link } from './Link';
import type { Region } from './Region';
import type { ServiceFlavor } from './ServiceFlavor';
import type { ServiceProviderContactDetails } from './ServiceProviderContactDetails';
export type UserOrderableServiceVo = {
    /**
     * The id of the orderable service.
     */
    serviceTemplateId: string;
    /**
     * The category of the orderable service.
     */
    category: UserOrderableServiceVo.category;
    /**
     * The name of the orderable service.
     */
    name: string;
    /**
     * The version of the orderable service.
     */
    version: string;
    /**
     * The Cloud Service Provider of the orderable service.
     */
    csp: UserOrderableServiceVo.csp;
    /**
     * The regions of the Cloud Service Provider.
     */
    regions: Array<Region>;
    /**
     * The description of the orderable service.
     */
    description: string;
    /**
     * The icon of the orderable service.
     */
    icon: string;
    /**
     * The variables for the deployment, which will be passed to the deployer.
     */
    variables: Array<DeployVariable>;
    /**
     * The flavors of the orderable service.
     */
    flavors: Array<ServiceFlavor>;
    billing: Billing;
    /**
     * Defines which cloud service account is used for deploying cloud resources.
     */
    serviceHostingType: UserOrderableServiceVo.serviceHostingType;
    serviceProviderContactDetails: ServiceProviderContactDetails;
    /**
     * The list of availability zone configuration of the service.
     */
    serviceAvailabilityConfigs?: Array<AvailabilityZoneConfig>;
    /**
     * End user license agreement content of the service.
     */
    eula?: string;
    links?: Array<Link>;
};
export namespace UserOrderableServiceVo {
    /**
     * The category of the orderable service.
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
     * The Cloud Service Provider of the orderable service.
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

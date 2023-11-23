/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeployRequest } from './DeployRequest';
import type { DeployResource } from './DeployResource';

export type DeployedServiceDetails = {
    /**
     * The ID of the service
     */
    id: string;
    /**
     * The catalog of the service
     */
    category: DeployedServiceDetails.category;
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
    csp: DeployedServiceDetails.csp;
    /**
     * The flavor of the service
     */
    flavor?: string;
    /**
     * The state of the service
     */
    serviceDeploymentState: DeployedServiceDetails.serviceDeploymentState;
    /**
     * Defines which cloud service account is used for deploying cloud resources.
     */
    serviceHostingType: DeployedServiceDetails.serviceHostingType;
    /**
     * Time of register service.
     */
    createTime: string;
    /**
     * Time of update service.
     */
    lastModifiedTime: string;
    deployRequest: DeployRequest;
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

export namespace DeployedServiceDetails {
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
     * The state of the service
     */
    export enum serviceDeploymentState {
        DEPLOYING = 'deploying',
        DEPLOYMENT_SUCCESSFUL = 'deployment successful',
        DEPLOYMENT_FAILED = 'deployment failed',
        DESTROYING = 'destroying',
        DESTROY_SUCCESSFUL = 'destroy successful',
        DESTROY_FAILED = 'destroy failed',
        MIGRATING = 'migrating',
        MIGRATION_SUCCESS = 'migration_success',
        MIGRATION_FAILED = 'migration_failed',
        MANUAL_CLEANUP_REQUIRED = 'manual cleanup required',
    }

    /**
     * Defines which cloud service account is used for deploying cloud resources.
     */
    export enum serviceHostingType {
        SELF = 'self',
        SERVICE_VENDOR = 'service-vendor',
    }
}

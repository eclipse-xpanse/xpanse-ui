/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilityZoneConfig } from './AvailabilityZoneConfig';
import type { DeployVariable } from './DeployVariable';
import type { ScriptsRepo } from './ScriptsRepo';
/**
 * The deployment of the managed service
 */
export type Deployment = {
    /**
     * The type of the Deployer which will handle the service deployment
     */
    kind: Deployment.kind;
    /**
     * The variables for the deployment, which will be passed to the deployer.The list elements must be unique.
     */
    variables: Array<DeployVariable>;
    /**
     * The credential type to do the deployment
     */
    credentialType?: Deployment.credentialType;
    /**
     * The list of availability zone configuration of the service.The list elements must be unique.
     */
    serviceAvailabilityConfigs?: Array<AvailabilityZoneConfig>;
    /**
     * The real deployer, something like terraform scripts. Either deployer or deployFromGitRepo must be provided.
     */
    deployer?: string;
    scriptsRepo?: ScriptsRepo;
};
export namespace Deployment {
    /**
     * The type of the Deployer which will handle the service deployment
     */
    export enum kind {
        TERRAFORM = 'terraform',
        OPENTOFU = 'opentofu',
    }
    /**
     * The credential type to do the deployment
     */
    export enum credentialType {
        VARIABLES = 'variables',
        HTTP_AUTHENTICATION = 'http_authentication',
        API_KEY = 'api_key',
        OAUTH2 = 'oauth2',
    }
}

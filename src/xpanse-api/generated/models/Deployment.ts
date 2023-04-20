/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeployVariable } from './DeployVariable';

/**
 * The deployment of the managed service
 */
export type Deployment = {
    /**
     * The type of the Deployer which will handle the service deployment
     */
    kind: Deployment.kind;
    /**
     * The variables for the deployment, which will be passed to the deployer
     */
    variables: Array<DeployVariable>;
    /**
     * The real deployer, something like terraform scripts...
     */
    deployer: string;
};

export namespace Deployment {
    /**
     * The type of the Deployer which will handle the service deployment
     */
    export enum kind {
        TERRAFORM = 'terraform',
    }
}

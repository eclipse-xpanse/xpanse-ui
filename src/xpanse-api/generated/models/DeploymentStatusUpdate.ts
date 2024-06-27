/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DeploymentStatusUpdate = {
    /**
     * Current state of the deployment request.
     */
    serviceDeploymentState: DeploymentStatusUpdate.serviceDeploymentState;
    /**
     * Describes if the deployment request is now completed
     */
    isOrderCompleted: boolean;
};
export namespace DeploymentStatusUpdate {
    /**
     * Current state of the deployment request.
     */
    export enum serviceDeploymentState {
        DEPLOYING = 'deploying',
        DEPLOYMENT_SUCCESSFUL = 'deployment successful',
        DEPLOYMENT_FAILED = 'deployment failed',
        DESTROYING = 'destroying',
        DESTROY_SUCCESSFUL = 'destroy successful',
        DESTROY_FAILED = 'destroy failed',
        MANUAL_CLEANUP_REQUIRED = 'manual cleanup required',
        ROLLBACK_FAILED = 'rollback failed',
        MODIFYING = 'modifying',
        MODIFICATION_FAILED = 'modification failed',
        MODIFICATION_SUCCESSFUL = 'modification successful',
    }
}

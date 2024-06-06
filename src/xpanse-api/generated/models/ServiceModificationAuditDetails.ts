/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeployRequest } from './DeployRequest';
import type { DeployResource } from './DeployResource';
/**
 * The latest service management audit details.
 */
export type ServiceModificationAuditDetails = {
    /**
     * The id of the service modification request.
     */
    serviceModificationRequestId: string;
    /**
     * The id of the deployed service.
     */
    serviceId: string;
    /**
     * The status of the service state management task.
     */
    taskStatus: ServiceModificationAuditDetails.taskStatus;
    /**
     * The error message of the failed management task.
     */
    errorMsg?: string;
    /**
     * The started time of the task.
     */
    startedTime?: string;
    /**
     * The completed time of the task.
     */
    completedTime?: string;
    previousDeployRequest: DeployRequest;
    newDeployRequest: DeployRequest;
    /**
     * The deployed resource list of the service before this modification.
     */
    previousDeployedResources?: Array<DeployResource>;
    /**
     * The properties of the deployed service before this modification.
     */
    previousDeployedServiceProperties?: Record<string, string>;
    /**
     * The properties of the deployed result before this modification.
     */
    previousDeployedResultProperties?: Record<string, string>;
};
export namespace ServiceModificationAuditDetails {
    /**
     * The status of the service state management task.
     */
    export enum taskStatus {
        CREATED = 'created',
        IN_PROGRESS = 'in progress',
        SUCCESSFUL = 'successful',
        FAILED = 'failed',
    }
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The latest running service management task details.
 */
export type ServiceStateManagementTaskDetails = {
    /**
     * The id of the service state management task.
     */
    taskId: string;
    /**
     * The id of the deployed service.
     */
    serviceId: string;
    /**
     * The type of the service state management task.
     */
    taskType: ServiceStateManagementTaskDetails.taskType;
    /**
     * The status of the service state management task.
     */
    taskStatus: ServiceStateManagementTaskDetails.taskStatus;
    /**
     * The error message of the failed management task.
     */
    errorMsg?: string;
    /**
     * The started time of the task.
     */
    startedTime: string;
    /**
     * The completed time of the task.
     */
    completedTime: string;
};
export namespace ServiceStateManagementTaskDetails {
    /**
     * The type of the service state management task.
     */
    export enum taskType {
        START = 'start',
        STOP = 'stop',
        RESTART = 'restart',
    }
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

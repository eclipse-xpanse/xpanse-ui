/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackendSystemStatus } from './BackendSystemStatus';
export type SystemStatus = {
    /**
     * The health status of Xpanse api service.
     */
    healthStatus: SystemStatus.healthStatus;
    /**
     * The health status of backend systems. This list contains status of identity provider and status of database.The status of identity provider will return when authorization is enabled.
     */
    backendSystemStatuses: Array<BackendSystemStatus>;
};
export namespace SystemStatus {
    /**
     * The health status of Xpanse api service.
     */
    export enum healthStatus {
        OK = 'OK',
        NOK = 'NOK',
    }
}

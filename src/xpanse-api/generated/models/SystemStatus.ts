/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SystemStatus = {
    healthStatus: SystemStatus.healthStatus;
};

export namespace SystemStatus {
    export enum healthStatus {
        OK = 'OK',
        NOK = 'NOK',
    }
}

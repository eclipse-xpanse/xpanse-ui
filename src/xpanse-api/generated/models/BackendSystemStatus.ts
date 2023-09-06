/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The health status of backend systems. This list contains status of identity provider and status of database.The status of identity provider will return when authorization is enabled.
 */
export type BackendSystemStatus = {
    /**
     * The type of backend system.
     */
    backendSystemType: BackendSystemStatus.backendSystemType;
    /**
     * The name of backend system.
     */
    name: string;
    /**
     * The health status of backend system.
     */
    healthStatus: BackendSystemStatus.healthStatus;
    /**
     * The endpoint of backend system. This filed is shown when the user have role 'admin' otherwise it is null.
     */
    endpoint?: string;
    /**
     * The details why health is not ok.This filed is shown when the user have role 'admin' otherwise it is null.
     */
    details?: string;
};

export namespace BackendSystemStatus {
    /**
     * The type of backend system.
     */
    export enum backendSystemType {
        IDENTITY_PROVIDER = 'IdentityProvider',
        DATABASE = 'Database',
        TERRAFORM_BOOT = 'Terraform Boot',
    }

    /**
     * The health status of backend system.
     */
    export enum healthStatus {
        OK = 'OK',
        NOK = 'NOK',
    }
}

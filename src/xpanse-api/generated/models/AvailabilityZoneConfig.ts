/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The list of availability zone configuration of the service.The list elements must be unique.
 */
export type AvailabilityZoneConfig = {
    /**
     * The display name of availability zone.
     */
    displayName: string;
    /**
     * The variable name of availability zone.
     */
    varName: string;
    /**
     * Indicates if the variable is mandatory.
     */
    mandatory: boolean;
    /**
     * The description of availability zone.
     */
    description?: string;
};

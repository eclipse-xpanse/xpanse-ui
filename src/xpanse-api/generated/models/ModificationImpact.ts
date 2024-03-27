/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Impact on service when flavor is changed.
 */
export type ModificationImpact = {
    /**
     * Is data lost when service configuration is modified.
     */
    isDataLost?: boolean;
    /**
     * Is service availability interrupted when the configuration is interrupted.
     */
    isServiceInterrupted?: boolean;
};

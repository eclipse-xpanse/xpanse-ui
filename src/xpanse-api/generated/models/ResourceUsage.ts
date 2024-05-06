/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Price } from './Price';
import type { Resource } from './Resource';
/**
 * The resource usage of the flavor in the managed service.
 */
export type ResourceUsage = {
    /**
     * The resources of the flavor of the manged service.
     */
    resources: Array<Resource>;
    licensePrice?: Price;
    markUpPrice?: Price;
};

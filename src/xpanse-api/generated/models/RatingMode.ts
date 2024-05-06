/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Price } from './Price';
import type { ResourceUsage } from './ResourceUsage';
/**
 * The pricing of the flavor
 */
export type RatingMode = {
    fixedPrice?: Price;
    resourceUsage?: ResourceUsage;
    /**
     * Whether the price is only for management layer. Consumption of the workload resources will be billed additionally..
     */
    isPriceOnlyForManagementLayer: boolean;
};

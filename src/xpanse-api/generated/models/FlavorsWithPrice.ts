/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModificationImpact } from './ModificationImpact';
import type { ServiceFlavorWithPrice } from './ServiceFlavorWithPrice';
/**
 * The flavors of the managed service
 */
export type FlavorsWithPrice = {
    /**
     * The flavors of the managed service. The list elements must be unique.
     */
    serviceFlavors: Array<ServiceFlavorWithPrice>;
    modificationImpact: ModificationImpact;
    /**
     * Whether the downgrading is allowed, default value: true.
     */
    isDowngradeAllowed: boolean;
    downgradeAllowed?: boolean;
};

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModificationImpact } from './ModificationImpact';
import type { ServiceFlavor } from './ServiceFlavor';
/**
 * The flavors of the managed service
 */
export type Flavors = {
    /**
     * The flavors of the managed service.
     */
    serviceFlavors: Array<ServiceFlavor>;
    modificationImpact: ModificationImpact;
};

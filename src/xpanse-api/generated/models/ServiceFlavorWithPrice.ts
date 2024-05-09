/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RatingMode } from './RatingMode';
/**
 * The flavors of the managed service.
 */
export type ServiceFlavorWithPrice = {
    /**
     * The flavor name
     */
    name: string;
    /**
     * The properties of the flavor
     */
    properties: Record<string, string>;
    /**
     * The priority of the flavor. The larger value means lower priority.
     */
    priority: number;
    /**
     * Important features and differentiators of the flavor.
     */
    features?: Array<string>;
    pricing: RatingMode;
};

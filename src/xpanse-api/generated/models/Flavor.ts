/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The flavors of the managed service
 */
export type Flavor = {
    /**
     * The flavor name
     */
    name: string;
    /**
     * The price of the flavor
     */
    fixedPrice: number;
    /**
     * The properties of the flavor
     */
    properties: Record<string, string>;
};

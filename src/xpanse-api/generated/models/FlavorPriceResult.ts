/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Price } from './Price';
export type FlavorPriceResult = {
    /**
     * The name of the flavor.
     */
    flavorName: string;
    /**
     * The billing mode of the price.
     */
    billingMode: FlavorPriceResult.billingMode;
    recurringPrice?: Price;
    oneTimePaymentPrice?: Price;
    /**
     * Error reason when price calculation fails.
     */
    errorMessage?: string;
    successful?: boolean;
};
export namespace FlavorPriceResult {
    /**
     * The billing mode of the price.
     */
    export enum billingMode {
        FIXED = 'Fixed',
        PAY_PER_USE = 'Pay per Use',
    }
}

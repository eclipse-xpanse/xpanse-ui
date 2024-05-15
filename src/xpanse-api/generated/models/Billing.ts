/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The billing policy of the managed service
 */
export type Billing = {
    /**
     * Supported billing modes by the managed service
     */
    billingModes: Array<'Fixed' | 'Pay per Use'>;
    /**
     *  This is used only for display purposes. When provided, this billingMode will be selected in the frontends by default.
     */
    defaultBillingMode?: Billing.defaultBillingMode;
};
export namespace Billing {
    /**
     *  This is used only for display purposes. When provided, this billingMode will be selected in the frontends by default.
     */
    export enum defaultBillingMode {
        FIXED = 'Fixed',
        PAY_PER_USE = 'Pay per Use',
    }
}

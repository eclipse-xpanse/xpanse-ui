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
     * The billing model of the managed service
     */
    billingModel: Billing.billingModel;
};
export namespace Billing {
    /**
     * The billing model of the managed service
     */
    export enum billingModel {
        YEARLY = 'yearly',
        MONTHLY = 'monthly',
        DAILY = 'daily',
        HOURLY = 'hourly',
        PAY_PER_USE = 'pay_per_use',
    }
}

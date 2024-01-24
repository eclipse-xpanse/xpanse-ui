/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The billing policy of the managed service
 */
export type Billing = {
    /**
     * The business model of the managed service
     */
    model: string;
    /**
     * The rental period of the managed service
     */
    period: Billing.period;
    /**
     * The billing currency of the managed service, valid values: euro,uso
     */
    currency: Billing.currency;
};
export namespace Billing {
    /**
     * The rental period of the managed service
     */
    export enum period {
        DAILY = 'daily',
        WEEKLY = 'weekly',
        MONTHLY = 'monthly',
        QUARTERLY = 'quarterly',
        YEARLY = 'yearly',
    }
    /**
     * The billing currency of the managed service, valid values: euro,uso
     */
    export enum currency {
        USD = 'usd',
        EURO = 'euro',
        GBP = 'gbp',
        CAD = 'cad',
        DEM = 'dem',
        FRF = 'frf',
        CNY = 'cny',
    }
}

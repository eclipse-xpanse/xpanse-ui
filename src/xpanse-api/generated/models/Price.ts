/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The listed price of the flavor of the manged service.
 */
export type Price = {
    /**
     * The value of the cost.
     */
    cost: number;
    /**
     * The currency of the cost.
     */
    currency: Price.currency;
    /**
     * The period of the cost.
     */
    period?: Price.period;
};
export namespace Price {
    /**
     * The currency of the cost.
     */
    export enum currency {
        USD = 'USD',
        EUR = 'EUR',
        CNY = 'CNY',
    }
    /**
     * The period of the cost.
     */
    export enum period {
        YEARLY = 'yearly',
        MONTHLY = 'monthly',
        DAILY = 'daily',
        HOURLY = 'hourly',
        ONE_TIME = 'oneTime',
    }
}

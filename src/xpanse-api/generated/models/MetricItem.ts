/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MetricItem = {
    labels?: Record<string, string>;
    type?: MetricItem.type;
    value?: number;
};

export namespace MetricItem {
    export enum type {
        VALUE = 'value',
        COUNT = 'count',
        SUM = 'sum',
    }
}

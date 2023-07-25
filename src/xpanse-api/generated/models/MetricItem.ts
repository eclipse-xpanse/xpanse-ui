/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The list of the metric items.
 */
export type MetricItem = {
    /**
     * The labels for the MetricItem.
     */
    labels?: Record<string, string>;
    /**
     * Type of the MetricItem.
     */
    type: MetricItem.type;
    /**
     * Timestamp of the recorded metric.
     */
    timeStamp: number;
    /**
     * value of the MetricItem.
     */
    value: number;
};

export namespace MetricItem {
    /**
     * Type of the MetricItem.
     */
    export enum type {
        VALUE = 'value',
        COUNT = 'count',
        SUM = 'sum',
    }
}

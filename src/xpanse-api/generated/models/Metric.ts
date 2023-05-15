/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MetricItem } from './MetricItem';

export type Metric = {
    name?: string;
    description?: string;
    type?: Metric.type;
    labels?: Record<string, string>;
    metrics?: Array<MetricItem>;
};

export namespace Metric {
    export enum type {
        COUNTER = 'counter',
        GAUGE = 'gauge',
        HISTOGRAM = 'histogram',
        SUMMARY = 'summary',
    }
}

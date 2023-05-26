/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Metric } from '../../../xpanse-api/generated';

export interface MetricProps {
    id: string;

    name: string;

    value: number;

    vmName: string;

    unit: Metric.unit;
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ColumnFilterItem } from 'antd/es/table/interface';
import { cspValues } from '../../utils/props.ts';

export const policiesStatuses: boolean[] = [true, false];

export type PolicyUploadFileStatus = 'notStarted' | 'inProgress' | 'completed' | 'error';

export const updateCspFilters = (): ColumnFilterItem[] => {
    const filters: ColumnFilterItem[] = [];
    Object.values(cspValues).forEach((csp) => {
        const filter = {
            text: csp,
            value: csp,
        };
        filters.push(filter);
    });
    return filters;
};

export const updateEnabledFilters = (): ColumnFilterItem[] => {
    const filters: ColumnFilterItem[] = [];

    [true, false].forEach((enabled) => {
        const filter = {
            text: String(enabled),
            value: enabled,
        };
        filters.push(filter);
    });

    return filters;
};

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { queryTasks, QueryTasksData } from '../../../../xpanse-api/generated';

export default function useAllTasksQuery(status: 'done' | 'failed' | undefined) {
    return useQuery({
        queryKey: getAllTasksQueryKey(status),
        queryFn: () => {
            const data: QueryTasksData = {
                status: status,
            };

            return queryTasks(data);
        },
    });
}

export function getAllTasksQueryKey(status: 'done' | 'failed' | undefined): string[] {
    if (status) {
        return ['allTasks', status];
    } else {
        return ['allTasks'];
    }
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { Options, queryTasks, QueryTasksData, WorkFlowTaskStatus } from '../../../../xpanse-api/generated';

export default function useAllTasksQuery(status: WorkFlowTaskStatus | undefined) {
    return useQuery({
        queryKey: getAllTasksQueryKey(status),
        queryFn: async () => {
            const data: Options<QueryTasksData> = {
                query: {
                    status: status,
                },
            };
            const response = await queryTasks(data);
            return response.data;
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

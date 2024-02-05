/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { WorkflowService } from '../../../../xpanse-api/generated/services/WorkFlowService';

export default function useAllTasksQuery(status: 'done' | 'failed' | undefined) {
    return useQuery({
        queryKey: ['allTasks', status],
        queryFn: () => WorkflowService.queryTasks(status),
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { stackHealthStatus } from '../../../xpanse-api/generated';

export function useStackCheckStatusQuery() {
    return useQuery({
        queryKey: ['stackHealthCheckQuery'],
        queryFn: async () => {
            const response = await stackHealthStatus();
            return response.data;
        },
        staleTime: 60000,
    });
}

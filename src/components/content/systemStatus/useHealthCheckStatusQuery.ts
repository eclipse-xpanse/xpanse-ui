/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { healthCheck } from '../../../xpanse-api/generated';

export function useHealthCheckStatusQuery() {
    return useQuery({
        queryKey: ['healthCheckQuery'],
        queryFn: () => healthCheck(),
        staleTime: 60000,
    });
}

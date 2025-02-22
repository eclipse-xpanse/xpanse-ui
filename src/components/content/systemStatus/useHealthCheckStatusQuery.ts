/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { healthCheck, stackHealthStatus } from '../../../xpanse-api/generated';

export function useHealthCheckStatusQuery() {
    return useQuery({
        queryKey: ['healthCheckQuery'],
        queryFn: () => healthCheck(),
        staleTime: 60000,
    });
}

export function useStackHealthCheckStatusQuery() {
    return useQuery({
        queryKey: ['stackHealthCheckQuery'],
        queryFn: () => stackHealthStatus(),
        staleTime: 60000,
    });
}

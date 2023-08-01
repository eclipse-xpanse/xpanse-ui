/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceService } from '../../../xpanse-api/generated';

export function useDeployedServicesByUserQuery(userName: string) {
    return useQuery({
        queryKey: ['monitor', userName],
        queryFn: () => ServiceService.getDeployedServicesByUser(userName),
        staleTime: 60000,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceService } from '../../../xpanse-api/generated';

export function useDeployedServicesByUserQuery() {
    return useQuery({
        queryKey: ['monitor'],
        queryFn: () => ServiceService.listMyDeployedServices(),
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
    });
}

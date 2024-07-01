/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listDeployedServices, ListDeployedServicesData } from '../../../xpanse-api/generated';

export function useDeployedServicesByUserQuery() {
    return useQuery({
        queryKey: ['monitor'],
        queryFn: () => {
            const data: ListDeployedServicesData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceState: undefined,
            };
            return listDeployedServices(data);
        },
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllDeployedServices, type GetAllDeployedServicesData } from '../../../xpanse-api/generated';

export function useDeployedServicesByUserQuery() {
    return useQuery({
        queryKey: ['monitor'],
        queryFn: () => {
            const data: GetAllDeployedServicesData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceState: undefined,
            };
            return getAllDeployedServices(data);
        },
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
    });
}

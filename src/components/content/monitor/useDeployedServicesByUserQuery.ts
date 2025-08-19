/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllDeployedServices, type GetAllDeployedServicesData, Options } from '../../../xpanse-api/generated';

export function useDeployedServicesByUserQuery() {
    return useQuery({
        queryKey: ['monitor'],
        queryFn: async () => {
            const request: Options<GetAllDeployedServicesData> = {
                query: {
                    categoryName: undefined,
                    cspName: undefined,
                    serviceName: undefined,
                    serviceVersion: undefined,
                    serviceState: undefined,
                },
            };
            const response = await getAllDeployedServices(request);
            return response.data;
        },
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
    });
}

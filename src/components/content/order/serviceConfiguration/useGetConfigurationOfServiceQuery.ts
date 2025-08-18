/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getCurrentConfigurationOfService,
    type GetCurrentConfigurationOfServiceData,
    Options,
} from '../../../../xpanse-api/generated';

export default function useGetCurrentConfigurationOfServiceQuery(serviceId: string) {
    return useQuery({
        queryKey: getCurrentConfigurationQueryKey(serviceId),
        queryFn: async () => {
            const data: Options<GetCurrentConfigurationOfServiceData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await getCurrentConfigurationOfService(data);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function getCurrentConfigurationQueryKey(serviceId: string): string[] {
    return ['getCurrentConfigurationOfService', serviceId];
}

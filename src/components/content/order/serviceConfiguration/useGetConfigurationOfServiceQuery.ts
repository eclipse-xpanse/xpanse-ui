/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getCurrentConfigurationOfService,
    type GetCurrentConfigurationOfServiceData,
} from '../../../../xpanse-api/generated';

export default function useGetCurrentConfigurationOfServiceQuery(serviceId: string) {
    return useQuery({
        queryKey: getCurrentConfigurationQueryKey(serviceId),
        queryFn: () => {
            const data: GetCurrentConfigurationOfServiceData = {
                serviceId: serviceId,
            };
            return getCurrentConfigurationOfService(data);
        },
        refetchOnWindowFocus: false,
    });
}

export function getCurrentConfigurationQueryKey(serviceId: string): string[] {
    return ['getCurrentConfigurationOfService', serviceId];
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { Category, getOrderableServices, GetOrderableServicesData, Options } from '../../../../xpanse-api/generated';

export default function UserOrderableServicesQuery(category: Category | undefined, serviceName: string | undefined) {
    return useQuery({
        queryKey: getOrderableServicesQueryKey(category, serviceName),
        queryFn: async () => {
            const request: Options<GetOrderableServicesData> = {
                query: {
                    categoryName: category,
                    cspName: undefined,
                    serviceName: serviceName,
                },
            };
            const response = await getOrderableServices(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function getOrderableServicesQueryKey(
    category: Category | undefined,
    serviceName: string | undefined
): string[] {
    if (category && serviceName) {
        return ['orderableServices', category, serviceName];
    }
    if (category === undefined && serviceName === undefined) {
        return ['orderableServices'];
    }
    if (category === undefined && serviceName !== undefined) {
        return ['orderableServices', serviceName];
    }
    if (category !== undefined && serviceName === undefined) {
        return ['orderableServices', category];
    }
    return [];
}

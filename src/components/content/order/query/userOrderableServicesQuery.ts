/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { category, getOrderableServices, type GetOrderableServicesData } from '../../../../xpanse-api/generated';

export default function UserOrderableServicesQuery(category: category | undefined, serviceName: string | undefined) {
    return useQuery({
        queryKey: ['orderableServices', category, serviceName],
        queryFn: () => {
            const data: GetOrderableServicesData = {
                categoryName: category,
                cspName: undefined,
                serviceName: serviceName,
            };
            return getOrderableServices(data);
        },
        refetchOnWindowFocus: false,
    });
}

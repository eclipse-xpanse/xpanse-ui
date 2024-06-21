/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DeployedService, listOrderableServices, ListOrderableServicesData } from '../../../../xpanse-api/generated';

export default function UserOrderableServicesQuery(
    category: DeployedService['category'],
    serviceName: string | undefined
) {
    return useQuery({
        queryKey: ['orderableServices', category, serviceName],
        queryFn: () => {
            const data: ListOrderableServicesData = {
                categoryName: category,
                cspName: undefined,
                serviceName: serviceName,
                serviceVersion: undefined,
                serviceHostingType: undefined,
            };
            return listOrderableServices(data);
        },
        refetchOnWindowFocus: false,
    });
}

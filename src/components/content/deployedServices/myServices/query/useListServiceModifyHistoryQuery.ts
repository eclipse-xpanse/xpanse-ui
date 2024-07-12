/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listServiceOrders, ListServiceOrdersData } from '../../../../../xpanse-api/generated';

export default function useListServiceModifyHistoryQuery(serviceId: string) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', serviceId],
        queryFn: () => {
            const data: ListServiceOrdersData = {
                serviceId: serviceId,
                taskType: 'modify',
                taskStatus: undefined,
            };
            return listServiceOrders(data);
        },
        refetchOnWindowFocus: false,
    });
}

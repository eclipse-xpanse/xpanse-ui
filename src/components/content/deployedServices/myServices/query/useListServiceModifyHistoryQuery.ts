/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllOrdersByServiceId, GetAllOrdersByServiceIdData } from '../../../../../xpanse-api/generated';

export default function useListServiceModifyHistoryQuery(serviceId: string) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', serviceId],
        queryFn: () => {
            const data: GetAllOrdersByServiceIdData = {
                serviceId: serviceId,
                taskType: 'modify',
                taskStatus: undefined,
            };
            return getAllOrdersByServiceId(data);
        },
        refetchOnWindowFocus: false,
    });
}

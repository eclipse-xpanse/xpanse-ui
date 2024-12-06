/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllOrdersByServiceId, GetAllOrdersByServiceIdData } from '../../../../../xpanse-api/generated';

export default function useListServiceOrdersHistoryQuery(serviceId: string) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', serviceId],
        queryFn: () => {
            const data: GetAllOrdersByServiceIdData = {
                serviceId: serviceId,
            };
            return getAllOrdersByServiceId(data);
        },
        refetchOnWindowFocus: false,
    });
}

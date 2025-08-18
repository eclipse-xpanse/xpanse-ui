/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getAllOrdersByServiceId,
    Options,
    type GetAllOrdersByServiceIdData,
} from '../../../../../xpanse-api/generated';

export default function useListServiceOrdersHistoryQuery(serviceId: string) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', serviceId],
        queryFn: async () => {
            const request: Options<GetAllOrdersByServiceIdData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await getAllOrdersByServiceId(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

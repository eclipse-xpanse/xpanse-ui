/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getOrderableServiceDetailsByServiceId,
    GetOrderableServiceDetailsByServiceIdData,
    Options,
} from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetailsByServiceIdQuery(serviceId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetailsByServiceId', serviceId],
        queryFn: async () => {
            const data: Options<GetOrderableServiceDetailsByServiceIdData> = {
                path: {
                    serviceId: serviceId ?? '',
                },
            };
            const response = await getOrderableServiceDetailsByServiceId(data);
            return response.data;
        },
        refetchOnWindowFocus: false,
        enabled: serviceId !== undefined && serviceId.length > 0,
    });
}

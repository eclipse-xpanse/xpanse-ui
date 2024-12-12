/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getOrderableServiceDetailsByServiceId,
    GetOrderableServiceDetailsByServiceIdData,
} from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetailsQuery(serviceId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetailsByServiceId', serviceId],
        queryFn: () => {
            const data: GetOrderableServiceDetailsByServiceIdData = {
                serviceId: serviceId ?? '',
            };
            return getOrderableServiceDetailsByServiceId(data);
        },
        refetchOnWindowFocus: false,
        enabled: serviceId !== undefined && serviceId.length > 0,
    });
}

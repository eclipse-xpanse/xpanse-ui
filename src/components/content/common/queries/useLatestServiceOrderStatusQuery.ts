/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getLatestServiceOrderStatus,
    GetLatestServiceOrderStatusData,
    orderStatus,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants.tsx';

export function useLatestServiceOrderStatusQuery(
    orderId: string | undefined,
    isStartPolling: boolean,
    refetchUntilStates: orderStatus[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', orderId],
        queryFn: () => {
            const data: GetLatestServiceOrderStatusData = {
                lastKnownServiceDeploymentState: undefined,
                orderId: orderId ?? '',
            };
            return getLatestServiceOrderStatus(data);
        },
        refetchInterval: (query) => {
            if (
                !query.state.data ||
                query.state.error ||
                refetchUntilStates.includes(query.state.data.orderStatus as orderStatus)
            ) {
                return false;
            }
            return deploymentStatusPollingInterval;
        },
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: orderId !== undefined && isStartPolling,
        gcTime: 0,
    });
}

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
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.orderStatus as orderStatus)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: orderId !== undefined && isStartPolling,
        gcTime: 0,
    });
}

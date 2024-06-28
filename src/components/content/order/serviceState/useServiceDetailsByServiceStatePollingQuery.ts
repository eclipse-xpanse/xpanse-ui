/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getSelfHostedServiceDetailsById,
    GetSelfHostedServiceDetailsByIdData,
    getVendorHostedServiceDetailsById,
    GetVendorHostedServiceDetailsByIdData,
    serviceHostingType,
    serviceState,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsByServiceStatePollingQuery(
    uuid: string | undefined,
    isStartPolling: boolean,
    currentServiceHostingType: string,
    refetchUntilStates: serviceState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', uuid, serviceHostingType],
        queryFn: () => {
            if (currentServiceHostingType.toString() === serviceHostingType.SELF) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    id: uuid ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    id: uuid ?? '',
                };
                return getVendorHostedServiceDetailsById(data);
            }
        },
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.serviceState as serviceState)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: uuid !== undefined && isStartPolling,
        gcTime: 0,
    });
}

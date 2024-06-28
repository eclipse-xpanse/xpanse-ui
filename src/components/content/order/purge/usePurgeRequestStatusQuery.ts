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
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function usePurgeRequestStatusQuery(
    uuid: string | undefined,
    currentServiceHostingType: string,
    isStartPolling: boolean
) {
    return useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid, serviceHostingType],
        queryFn: () => {
            if (currentServiceHostingType === serviceHostingType.SELF.toString()) {
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
        refetchOnWindowFocus: false,
        refetchInterval: (query) => (query.state.status !== 'error' && uuid ? deploymentStatusPollingInterval : false),
        enabled: uuid !== undefined && isStartPolling,
        retry: 0,
    });
}

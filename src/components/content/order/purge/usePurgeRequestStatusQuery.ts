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
    currentServiceHostingType: serviceHostingType,
    isStartPolling: boolean,
    isPurgeRequestSubmitted: boolean
) {
    return useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid, currentServiceHostingType],
        queryFn: () => {
            if (currentServiceHostingType === serviceHostingType.SELF) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    serviceId: uuid ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    serviceId: uuid ?? '',
                };
                return getVendorHostedServiceDetailsById(data);
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: (query) => (query.state.status !== 'error' && uuid ? deploymentStatusPollingInterval : false),
        enabled: uuid !== undefined && isStartPolling && isPurgeRequestSubmitted,
        retry: 0,
    });
}

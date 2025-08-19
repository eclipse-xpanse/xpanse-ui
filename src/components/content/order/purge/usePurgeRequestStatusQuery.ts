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
    Options,
    ServiceHostingType,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function usePurgeRequestStatusQuery(
    uuid: string | undefined,
    currentServiceHostingType: ServiceHostingType,
    isStartPolling: boolean,
    isPurgeRequestSubmitted: boolean
) {
    return useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid, currentServiceHostingType],
        queryFn: async () => {
            if (currentServiceHostingType === ServiceHostingType.SELF) {
                const request: Options<GetSelfHostedServiceDetailsByIdData> = {
                    path: {
                        serviceId: uuid ?? '',
                    },
                };
                const response = await getSelfHostedServiceDetailsById(request);
                return response.data;
            } else {
                const request: Options<GetVendorHostedServiceDetailsByIdData> = {
                    path: {
                        serviceId: uuid ?? '',
                    },
                };
                const response = await getVendorHostedServiceDetailsById(request);
                return response.data;
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: (query) => (query.state.status !== 'error' && uuid ? deploymentStatusPollingInterval : false),
        enabled: uuid !== undefined && isStartPolling && isPurgeRequestSubmitted,
        retry: 0,
    });
}

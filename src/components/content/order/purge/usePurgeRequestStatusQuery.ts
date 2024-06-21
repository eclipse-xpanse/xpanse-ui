/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    DeployedService,
    getSelfHostedServiceDetailsById,
    GetSelfHostedServiceDetailsByIdData,
    getVendorHostedServiceDetailsById,
    GetVendorHostedServiceDetailsByIdData,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function usePurgeRequestStatusQuery(
    uuid: string | undefined,
    serviceHostingType: DeployedService['serviceHostingType'],
    isStartPolling: boolean
) {
    return useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType.toString() === 'self') {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    id: uuid ?? '',
                };
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    id: uuid ?? '',
                };
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return getVendorHostedServiceDetailsById(data);
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: (query) => (query.state.status !== 'error' && uuid ? deploymentStatusPollingInterval : false),
        enabled: uuid !== undefined && isStartPolling,
        retry: 0,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    DeployedService,
    DeployedServiceDetails,
    getSelfHostedServiceDetailsById,
    GetSelfHostedServiceDetailsByIdData,
    getVendorHostedServiceDetailsById,
    GetVendorHostedServiceDetailsByIdData,
} from '../../../../xpanse-api/generated';

import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsByServiceStatePollingQuery(
    uuid: string | undefined,
    isStartPolling: boolean,
    serviceHostingType: DeployedService['serviceHostingType'],
    refetchUntilStates: DeployedServiceDetails['serviceState'][]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', uuid, serviceHostingType],
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
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.serviceState)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: uuid !== undefined && isStartPolling,
        gcTime: 0,
    });
}

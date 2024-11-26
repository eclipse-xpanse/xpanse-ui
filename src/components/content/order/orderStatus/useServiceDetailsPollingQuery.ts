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
    serviceDeploymentState,
    serviceHostingType,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsPollingQuery(
    serviceId: string | undefined,
    isStartPolling: boolean,
    currentHostingType: serviceHostingType,
    refetchUntilStates: serviceDeploymentState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, currentHostingType],
        queryFn: () => {
            if (currentHostingType === serviceHostingType.SELF) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };

                return getVendorHostedServiceDetailsById(data);
            }
        },
        refetchInterval: (query) =>
            query.state.data &&
            refetchUntilStates.includes(query.state.data.serviceDeploymentState as serviceDeploymentState)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: serviceId !== undefined && isStartPolling,
        gcTime: 0,
    });
}

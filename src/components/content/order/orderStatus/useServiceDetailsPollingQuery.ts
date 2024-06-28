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
    uuid: string | undefined,
    isStartPolling: boolean,
    currentHostingType: string,
    refetchUntilStates: serviceDeploymentState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', uuid, currentHostingType],
        queryFn: () => {
            if (currentHostingType === serviceHostingType.SELF.toString()) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    id: uuid ?? '',
                };
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
            query.state.data &&
            refetchUntilStates.includes(query.state.data.serviceDeploymentState as serviceDeploymentState)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: uuid !== undefined && isStartPolling,
        gcTime: 0,
    });
}

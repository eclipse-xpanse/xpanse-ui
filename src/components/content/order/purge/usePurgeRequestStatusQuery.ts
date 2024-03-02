/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DeployedService, ServiceService } from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function usePurgeRequestStatusQuery(
    uuid: string | undefined,
    serviceHostingType: DeployedService.serviceHostingType,
    isStartPolling: boolean
) {
    return useQuery({
        queryKey: ['getPurgeServiceDetailsById', uuid, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return ServiceService.getSelfHostedServiceDetailsById(uuid!);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return ServiceService.getVendorHostedServiceDetailsById(uuid!);
            }
        },
        refetchOnWindowFocus: false,
        refetchInterval: (query) => (query.state.status !== 'error' && uuid ? deploymentStatusPollingInterval : false),
        enabled: uuid !== undefined && isStartPolling,
        retry: 0,
    });
}

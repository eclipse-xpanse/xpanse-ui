/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceDetailVo, ServiceService } from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsPollingQuery(
    uuid: string | undefined,
    isStartPolling: boolean,
    refetchUntilStates: ServiceDetailVo.serviceDeploymentState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', uuid],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryFn: () => ServiceService.getServiceDetailsById(uuid!),
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.serviceDeploymentState)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: uuid !== undefined && isStartPolling,
    });
}

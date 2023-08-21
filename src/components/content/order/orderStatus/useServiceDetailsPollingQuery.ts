/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceDetailVo, ServiceService } from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsPollingQuery(
    uuid: string | undefined,
    refetchUntilStates: ServiceDetailVo.serviceDeploymentState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', uuid],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryFn: () => ServiceService.getServiceDetailsById(uuid!),
        refetchInterval: (data) =>
            data && refetchUntilStates.includes(data.serviceDeploymentState) ? false : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: uuid !== undefined,
    });
}

export function useServiceDestroyDetailsPollingQuery(
    uuid: string,
    isDestroyDetailsQuerying: boolean,
    refetchUntilStates: ServiceDetailVo.serviceDeploymentState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', uuid],
        queryFn: () => ServiceService.getServiceDetailsById(uuid),
        refetchInterval: (data) =>
            data && refetchUntilStates.includes(data.serviceDeploymentState) ? false : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: uuid.length > 0 && isDestroyDetailsQuerying,
    });
}

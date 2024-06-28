/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, stopService, type StopServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateStopQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            const data: StopServiceData = {
                serviceId: deployedService.serviceId,
            };
            return stopService(data);
        },
        onSuccess: refreshData,
    });
}

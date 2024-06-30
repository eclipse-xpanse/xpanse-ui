/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, restartService, type RestartServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateRestartQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            const data: RestartServiceData = {
                serviceId: deployedService.serviceId,
            };
            return restartService(data);
        },
        onSuccess: refreshData,
    });
}

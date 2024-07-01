/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, startService, type StartServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateStartQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            const data: StartServiceData = {
                serviceId: deployedService.serviceId,
            };
            return startService(data);
        },
        onSuccess: refreshData,
    });
}

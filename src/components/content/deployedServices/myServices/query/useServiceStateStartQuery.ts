/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, ServiceStatusManagementService } from '../../../../../xpanse-api/generated';

export function useServiceStateStartQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            deployedService.serviceState = DeployedService.serviceState.STARTING;
            return ServiceStatusManagementService.startService(deployedService.id);
        },
        onSuccess: refreshData,
        onSettled: (data: DeployedService | undefined, _error, deployedService: DeployedService, _context) => {
            if (data) {
                deployedService.serviceState = data.serviceState;
            }
        },
    });
}

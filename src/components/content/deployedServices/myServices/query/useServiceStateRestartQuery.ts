/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, ServiceStatusManagementService } from '../../../../../xpanse-api/generated';

export function useServiceStateRestartQuery() {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            deployedService.serviceState = DeployedService.serviceState.STOPPING;
            return ServiceStatusManagementService.restartService(deployedService.id);
        },
        onSettled: (data: DeployedService | undefined, _error, deployedService: DeployedService, _context) => {
            if (data) {
                deployedService.serviceState = data.serviceState;
            }
        },
    });
}

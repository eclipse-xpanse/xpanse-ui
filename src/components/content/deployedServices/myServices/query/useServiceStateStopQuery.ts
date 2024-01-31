/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, ServiceStatusManagementService } from '../../../../../xpanse-api/generated';

export function useServiceStateStopQuery() {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            deployedService.serviceState = DeployedService.serviceState.STOPPING;
            return ServiceStatusManagementService.stopService(deployedService.id);
        },
        onSettled: (data, _error, variables, _context) => {
            if (data) {
                variables.serviceState = data.serviceState;
            }
        },
    });
}

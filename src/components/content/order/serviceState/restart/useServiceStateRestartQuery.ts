/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployedService, ServiceStatusManagementService } from '../../../../../xpanse-api/generated';

export function useServiceStateRestartQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (deployedService: DeployedService) => {
            return ServiceStatusManagementService.restartService(deployedService.id);
        },
        onSuccess: refreshData,
    });
}

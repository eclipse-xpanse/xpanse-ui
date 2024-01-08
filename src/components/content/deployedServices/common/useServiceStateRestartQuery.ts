/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { ServiceStatusManagementService } from '../../../../xpanse-api/generated';

export function useServiceStateRestartQuery() {
    return useMutation({
        mutationFn: (id: string) => {
            return ServiceStatusManagementService.restartService(id);
        },
    });
}

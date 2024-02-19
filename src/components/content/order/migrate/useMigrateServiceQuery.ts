/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { MigrateRequest, MigrationService } from '../../../../xpanse-api/generated';

export function useMigrateServiceQuery() {
    return useMutation({
        mutationFn: (migrateRequest: MigrateRequest) => {
            return MigrationService.migrate(migrateRequest);
        },
    });
}

export function useMigrateServiceDetailsQuery(processInstanceId: string) {
    return useQuery({
        queryKey: ['migrationServiceDetails', processInstanceId],
        queryFn: () => MigrationService.getMigrationOrderDetailsById(processInstanceId),
        enabled: processInstanceId.length > 0,
    });
}

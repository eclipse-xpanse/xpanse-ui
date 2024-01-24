/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { MigrateRequest, MigrationService } from '../../../../xpanse-api/generated';

export function useMigrateServiceQuery() {
    return useMutation({
        mutationFn: (migrateRequest: MigrateRequest) => {
            return MigrationService.migrate(migrateRequest);
        },
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { MigrateRequest, ServiceService } from '../../../../xpanse-api/generated';

export function useMigrateServiceQuery() {
    return useMutation({
        mutationFn: (migrateRequest: MigrateRequest) => {
            return ServiceService.migrate(migrateRequest);
        },
    });
}

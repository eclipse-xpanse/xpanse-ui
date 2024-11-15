/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { migrate, MigrateData, MigrateRequest } from '../../../../xpanse-api/generated';

export function useMigrateServiceRequest() {
    return useMutation({
        mutationFn: (migrateRequest: MigrateRequest) => {
            const data: MigrateData = {
                requestBody: migrateRequest,
            };
            return migrate(data);
        },
    });
}

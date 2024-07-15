/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { purge, type PurgeData } from '../../../../xpanse-api/generated';

export function usePurgeRequestSubmitQuery() {
    return useMutation({
        mutationFn: (id: string) => {
            const data: PurgeData = {
                serviceId: id,
            };
            return purge(data);
        },
    });
}

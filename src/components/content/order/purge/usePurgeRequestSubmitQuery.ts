/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, purge, PurgeData } from '../../../../xpanse-api/generated';

export function usePurgeRequestSubmitQuery() {
    return useMutation({
        mutationFn: async (id: string) => {
            const request: Options<PurgeData> = {
                path: {
                    serviceId: id,
                },
            };
            const response = await purge(request);
            return response.data;
        },
    });
}

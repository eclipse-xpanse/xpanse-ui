/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, startService, type StartServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateStartQuery() {
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const request: Options<StartServiceData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await startService(request);
            return response.data;
        },
    });
}

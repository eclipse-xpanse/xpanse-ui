/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, stopService, StopServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateStopQuery() {
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const request: Options<StopServiceData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await stopService(request);
            return response.data;
        },
    });
}

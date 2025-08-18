/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, restartService, type RestartServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateRestartQuery() {
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const request: Options<RestartServiceData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await restartService(request);
            return response.data;
        },
    });
}

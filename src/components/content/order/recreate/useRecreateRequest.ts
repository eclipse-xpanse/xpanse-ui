/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, recreateService, type RecreateServiceData } from '../../../../xpanse-api/generated/';

export default function useRecreateRequest() {
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const request: Options<RecreateServiceData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await recreateService(request);
            return response.data;
        },
    });
}

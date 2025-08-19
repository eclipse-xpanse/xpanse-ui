/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { destroy, DestroyData, Options } from '../../../../xpanse-api/generated';

export function useDestroyRequestSubmitQuery() {
    return useMutation({
        mutationFn: async (id: string) => {
            const request: Options<DestroyData> = {
                path: {
                    serviceId: id,
                },
            };
            const response = await destroy(request);
            return response.data;
        },
    });
}

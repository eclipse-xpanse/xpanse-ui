/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, unpublish, type UnpublishData } from '../../../../../xpanse-api/generated';

const unpublishKey: string = 'unpublish';

export function useUnpublishRequest(id: string) {
    return useMutation({
        mutationKey: [id, unpublishKey],
        mutationFn: async () => {
            const request: Options<UnpublishData> = {
                path: {
                    serviceTemplateId: id,
                },
            };
            const response = await unpublish(request);
            return response.data;
        },
        // necessary to clear the mutationCache immediately.
        // Otherwise, the mutation state is cached and with retries, it is not possible to get the state of the
        // latest request using useMutationState method.
        gcTime: 0,
    });
}

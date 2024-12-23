/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import { unpublish, type UnpublishData } from '../../../../../xpanse-api/generated';

const unpublishKey: string = 'unpublish';

export function useUnpublishRequest(id: string) {
    return useMutation({
        mutationKey: [id, unpublishKey],
        mutationFn: () => {
            const data: UnpublishData = {
                serviceTemplateId: id,
            };
            return unpublish(data);
        },
        // necessary to clear the mutationCache immediately.
        // Otherwise, the mutation state is cached and with retries, it is not possible to get state of the
        // latest request using useMutationState method.
        gcTime: 0,
    });
}

export function useGetUnpublishMutationState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, unpublishKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

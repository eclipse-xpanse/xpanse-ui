/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import { unregister, type UnregisterData } from '../../../../../xpanse-api/generated';

const unregisterKey: string = 'unregister';

export function useUnregisterRequest(id: string) {
    return useMutation({
        mutationKey: [id, unregisterKey],
        mutationFn: () => {
            const data: UnregisterData = {
                id: id,
            };
            return unregister(data);
        },
        // necessary to clear the mutationCache immediately.
        // Otherwise, the mutation state is cached and with retries, it is not possible to get state of the
        // latest request using useMutationState method.
        gcTime: 0,
    });
}

export function useGetUnregisterMutationState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, unregisterKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

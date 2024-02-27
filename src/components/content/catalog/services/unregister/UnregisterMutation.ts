/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import { ServiceVendorService } from '../../../../../xpanse-api/generated';

const unregisterKey: string = 'unregister';

export function useUnregisterRequest(id: string) {
    return useMutation({
        mutationKey: [id, unregisterKey],
        mutationFn: () => {
            return ServiceVendorService.unregister(id);
        },
    });
}

export function useGetUnregisterMutationState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, unregisterKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

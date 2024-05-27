/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import { ServiceLockConfig, ServiceService } from '../../../../xpanse-api/generated';

const lockKey: string = 'lock';

export function useLockRequest(id: string) {
    return useMutation({
        mutationKey: [id, lockKey],
        mutationFn: (requestBody: { id: string; lockConfig: ServiceLockConfig }) => {
            return ServiceService.changeServiceLockConfig(requestBody.id, requestBody.lockConfig);
        },
    });
}

export function useLockRequestState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, lockKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

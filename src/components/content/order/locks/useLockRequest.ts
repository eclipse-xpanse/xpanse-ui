/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import {
    ChangeServiceLockConfigData,
    ServiceLockConfig,
    changeServiceLockConfig,
} from '../../../../xpanse-api/generated';

const lockKey: string = 'lock';

export function useLockRequest(serviceId: string) {
    return useMutation({
        mutationKey: [serviceId, lockKey],
        mutationFn: (requestBody: { serviceId: string; lockConfig: ServiceLockConfig }) => {
            const data: ChangeServiceLockConfigData = {
                serviceId: requestBody.serviceId,
                requestBody: requestBody.lockConfig,
            };
            return changeServiceLockConfig(data);
        },
    });
}

export function useLockRequestState(serviceId: string) {
    return useMutationState({
        filters: { mutationKey: [serviceId, lockKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

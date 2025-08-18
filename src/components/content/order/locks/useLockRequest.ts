/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import {
    changeServiceLockConfig,
    ChangeServiceLockConfigData,
    Options,
    ServiceLockConfig,
} from '../../../../xpanse-api/generated';

const lockKey: string = 'lock';

export function useLockRequest(serviceId: string) {
    return useMutation({
        mutationKey: [serviceId, lockKey],
        mutationFn: async (requestBody: { serviceId: string; lockConfig: ServiceLockConfig }) => {
            const request: Options<ChangeServiceLockConfigData> = {
                body: requestBody.lockConfig,
                path: {
                    serviceId: requestBody.serviceId,
                },
            };
            const response = await changeServiceLockConfig(request);
            return response.data;
        },
    });
}

export function useLockRequestState(serviceId: string) {
    return useMutationState({
        filters: { mutationKey: [serviceId, lockKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

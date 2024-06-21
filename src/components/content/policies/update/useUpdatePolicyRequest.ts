/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { updateUserPolicy, UpdateUserPolicyData, UserPolicyUpdateRequest } from '../../../../xpanse-api/generated';

export function useUpdatePolicyRequest() {
    return useMutation({
        mutationFn: ({ id, requestBody }: { id: string; requestBody: UserPolicyUpdateRequest }) => {
            const data: UpdateUserPolicyData = {
                id: id,
                requestBody: requestBody,
            };
            return updateUserPolicy(data);
        },
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { UserPolicyUpdateRequest, updateUserPolicy, type UpdateUserPolicyData } from '../../../../xpanse-api/generated';

export function useUpdateUserPolicyRequest() {
    return useMutation({
        mutationFn: ({ userPolicyId, requestBody }: { userPolicyId: string; requestBody: UserPolicyUpdateRequest }) => {
            const data: UpdateUserPolicyData = {
                userPolicyId: userPolicyId,
                requestBody: requestBody,
            };
            return updateUserPolicy(data);
        },
    });
}

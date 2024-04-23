/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { UserPoliciesManagementService, UserPolicyUpdateRequest } from '../../../../xpanse-api/generated';

export function useUpdatePolicyRequest() {
    return useMutation({
        mutationFn: ({ id, requestBody }: { id: string; requestBody: UserPolicyUpdateRequest }) => {
            return UserPoliciesManagementService.updateUserPolicy(id, requestBody);
        },
    });
}

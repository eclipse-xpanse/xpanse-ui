/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteUserPolicy, DeleteUserPolicyData } from '../../../../xpanse-api/generated';

export function useDeletePolicyRequest() {
    return useMutation({
        mutationFn: (policyId: string) => {
            const data: DeleteUserPolicyData = {
                policyId: policyId,
            };
            return deleteUserPolicy(data);
        },
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteUserPolicy, DeleteUserPolicyData } from '../../../../xpanse-api/generated';

export function useDeleteUserPolicyRequest() {
    return useMutation({
        mutationFn: (userPolicyId: string) => {
            const data: DeleteUserPolicyData = {
                userPolicyId: userPolicyId,
            };
            return deleteUserPolicy(data);
        },
    });
}

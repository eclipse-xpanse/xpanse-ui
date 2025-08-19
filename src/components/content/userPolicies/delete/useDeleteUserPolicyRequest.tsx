/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteUserPolicy, DeleteUserPolicyData, Options } from '../../../../xpanse-api/generated';

export function useDeleteUserPolicyRequest() {
    return useMutation({
        mutationFn: async (userPolicyId: string) => {
            const request: Options<DeleteUserPolicyData> = {
                path: {
                    userPolicyId: userPolicyId,
                },
            };
            const response = await deleteUserPolicy(request);
            return response.data;
        },
    });
}

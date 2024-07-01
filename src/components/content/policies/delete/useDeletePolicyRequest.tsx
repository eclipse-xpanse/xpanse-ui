/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteUserPolicy, DeleteUserPolicyData } from '../../../../xpanse-api/generated';

export function useDeletePolicyRequest() {
    return useMutation({
        mutationFn: (id: string) => {
            const data: DeleteUserPolicyData = {
                id: id,
            };
            return deleteUserPolicy(data);
        },
    });
}

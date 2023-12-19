/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { UserPoliciesManagementService } from '../../../../xpanse-api/generated';

export function useDeletePolicyRequest() {
    return useMutation({
        mutationFn: (id: string) => {
            return UserPoliciesManagementService.deleteUserPolicy(id);
        },
    });
}

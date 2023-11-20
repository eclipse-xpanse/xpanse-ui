/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { PoliciesManagementService } from '../../../../xpanse-api/generated';

export function useDeletePolicyRequest() {
    return useMutation({
        mutationFn: (id: string) => {
            return PoliciesManagementService.deletePolicy(id);
        },
    });
}

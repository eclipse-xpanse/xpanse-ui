/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { PoliciesManagementService, PolicyUpdateRequest } from '../../../../xpanse-api/generated';

export function useUpdatePolicyRequest() {
    return useMutation({
        mutationFn: (requestBody: PolicyUpdateRequest) => {
            return PoliciesManagementService.updatePolicy(requestBody);
        },
    });
}

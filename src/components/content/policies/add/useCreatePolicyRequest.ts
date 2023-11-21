/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { PoliciesManagementService, PolicyCreateRequest } from '../../../../xpanse-api/generated';

export function useCreatePolicyRequest() {
    return useMutation({
        mutationFn: (requestBody: PolicyCreateRequest) => {
            return PoliciesManagementService.addPolicy(requestBody);
        },
    });
}

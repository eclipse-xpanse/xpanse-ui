/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { ServicePoliciesManagementService, ServicePolicyUpdateRequest } from '../../../../../../xpanse-api/generated';

export const useUpdateServicePolicy = () => {
    return useMutation({
        mutationFn: (policyUpdateRequest: ServicePolicyUpdateRequest) => {
            return ServicePoliciesManagementService.updateServicePolicy(policyUpdateRequest);
        },
    });
};

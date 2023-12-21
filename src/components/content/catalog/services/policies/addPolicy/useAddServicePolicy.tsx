/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { ServicePoliciesManagementService, ServicePolicyCreateRequest } from '../../../../../../xpanse-api/generated';

export const useAddServicePolicy = () => {
    return useMutation({
        mutationFn: (policyRequest: ServicePolicyCreateRequest) => {
            return ServicePoliciesManagementService.addServicePolicy(policyRequest);
        },
    });
};

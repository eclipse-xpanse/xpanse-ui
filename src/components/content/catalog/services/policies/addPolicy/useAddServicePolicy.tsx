/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    ServicePolicyCreateRequest,
    addServicePolicy,
    type AddServicePolicyData,
} from '../../../../../../xpanse-api/generated';

export const useAddServicePolicy = () => {
    return useMutation({
        mutationFn: (policyRequest: ServicePolicyCreateRequest) => {
            const data: AddServicePolicyData = {
                requestBody: policyRequest,
            };
            return addServicePolicy(data);
        },
    });
};

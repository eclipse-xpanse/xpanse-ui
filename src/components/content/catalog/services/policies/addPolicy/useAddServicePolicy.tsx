/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    addServicePolicy,
    AddServicePolicyData,
    ServicePolicyCreateRequest,
} from '../../../../../../xpanse-api/generated';

export const useAddServicePolicy = () => {
    return useMutation({
        mutationFn: (policyRequest: ServicePolicyCreateRequest) => {
            const deleteData: AddServicePolicyData = {
                requestBody: policyRequest,
            };
            return addServicePolicy(deleteData);
        },
    });
};

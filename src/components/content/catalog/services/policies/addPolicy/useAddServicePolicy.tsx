/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    addServicePolicy,
    AddServicePolicyData,
    Options,
    ServicePolicyCreateRequest,
} from '../../../../../../xpanse-api/generated';

export const useAddServicePolicy = () => {
    return useMutation({
        mutationFn: async (policyRequest: ServicePolicyCreateRequest) => {
            const data: Options<AddServicePolicyData> = {
                body: policyRequest,
            };
            const response = await addServicePolicy(data);
            return response.data;
        },
    });
};

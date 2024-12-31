/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    ServicePolicyUpdateRequest,
    updateServicePolicy,
    type UpdateServicePolicyData,
} from '../../../../../../xpanse-api/generated';

export const useUpdateServicePolicy = () => {
    return useMutation({
        mutationFn: ({
            servicePolicyId,
            servicePolicyUpdateRequest,
        }: {
            servicePolicyId: string;
            servicePolicyUpdateRequest: ServicePolicyUpdateRequest;
        }) => {
            const data: UpdateServicePolicyData = {
                servicePolicyId: servicePolicyId,
                requestBody: servicePolicyUpdateRequest,
            };
            return updateServicePolicy(data);
        },
    });
};

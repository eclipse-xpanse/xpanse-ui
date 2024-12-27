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
            policyId,
            policyUpdateRequest,
        }: {
            policyId: string;
            policyUpdateRequest: ServicePolicyUpdateRequest;
        }) => {
            const data: UpdateServicePolicyData = {
                policyId: policyId,
                requestBody: policyUpdateRequest,
            };
            return updateServicePolicy(data);
        },
    });
};

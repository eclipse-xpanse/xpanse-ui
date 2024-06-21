/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    ServicePolicyUpdateRequest,
    updateServicePolicy,
    UpdateServicePolicyData,
} from '../../../../../../xpanse-api/generated';

export const useUpdateServicePolicy = () => {
    return useMutation({
        mutationFn: ({ id, policyUpdateRequest }: { id: string; policyUpdateRequest: ServicePolicyUpdateRequest }) => {
            const data: UpdateServicePolicyData = {
                id: id,
                requestBody: policyUpdateRequest,
            };
            return updateServicePolicy(data);
        },
    });
};

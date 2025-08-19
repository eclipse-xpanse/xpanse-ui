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
import { Options } from '../../../../../../xpanse-api/generated/client';

export const useUpdateServicePolicy = () => {
    return useMutation({
        mutationFn: async ({
            servicePolicyId,
            servicePolicyUpdateRequest,
        }: {
            servicePolicyId: string;
            servicePolicyUpdateRequest: ServicePolicyUpdateRequest;
        }) => {
            const request: Options<UpdateServicePolicyData> = {
                body: servicePolicyUpdateRequest,
                path: {
                    servicePolicyId: servicePolicyId,
                },
            };
            const response = await updateServicePolicy(request);
            return response.data;
        },
    });
};

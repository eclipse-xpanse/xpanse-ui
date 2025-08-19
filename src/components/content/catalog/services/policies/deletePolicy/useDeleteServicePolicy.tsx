/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteServicePolicy, DeleteServicePolicyData, Options } from '../../../../../../xpanse-api/generated';

export const useDeleteServicePolicy = () => {
    return useMutation({
        mutationFn: async (servicePolicyId: string) => {
            const request: Options<DeleteServicePolicyData> = {
                path: {
                    servicePolicyId: servicePolicyId,
                },
            };
            const response = await deleteServicePolicy(request);
            return response.data;
        },
    });
};

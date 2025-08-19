/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllServicePolicies, GetAllServicePoliciesData, Options } from '../../../../../../xpanse-api/generated';

export const useGetServicePolicyList = (serviceTemplateId: string) => {
    return useQuery({
        queryKey: ['listServicePolicies', serviceTemplateId],
        queryFn: async () => {
            const request: Options<GetAllServicePoliciesData> = {
                query: {
                    serviceTemplateId: serviceTemplateId,
                },
            };
            const response = await getAllServicePolicies(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
        enabled: serviceTemplateId.length > 0,
    });
};

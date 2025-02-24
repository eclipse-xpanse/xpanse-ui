/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllServicePolicies, type GetAllServicePoliciesData } from '../../../../../../xpanse-api/generated';

export const useGetServicePolicyList = (serviceTemplateId: string) => {
    return useQuery({
        queryKey: ['listServicePolicies', serviceTemplateId],
        queryFn: () => {
            const data: GetAllServicePoliciesData = {
                serviceTemplateId: serviceTemplateId,
            };
            return getAllServicePolicies(data);
        },
        refetchOnWindowFocus: false,
        enabled: serviceTemplateId.length > 0,
    });
};

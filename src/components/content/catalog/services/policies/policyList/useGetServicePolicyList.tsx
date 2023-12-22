/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServicePoliciesManagementService } from '../../../../../../xpanse-api/generated';

export const useGetServicePolicyList = (serviceTemplateId: string) => {
    return useQuery({
        queryKey: ['listServicePolicies', serviceTemplateId],
        queryFn: () => {
            return ServicePoliciesManagementService.listServicePolicies(serviceTemplateId);
        },
        refetchOnWindowFocus: false,
        enabled: serviceTemplateId.length > 0,
    });
};

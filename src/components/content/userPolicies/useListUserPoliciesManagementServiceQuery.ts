/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllUserPolicies, GetAllUserPoliciesData, Options } from '../../../xpanse-api/generated';

export default function useListUserPoliciesManagementServiceQuery() {
    return useQuery({
        queryKey: ['listUserPoliciesManagementService'],
        queryFn: async () => {
            const request: Options<GetAllUserPoliciesData> = {
                query: {
                    cspName: undefined,
                    enabled: undefined,
                },
            };
            const response = await getAllUserPolicies(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

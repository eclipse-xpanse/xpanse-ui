/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllUserPolicies, type GetAllUserPoliciesData } from '../../../xpanse-api/generated';

export default function useListUserPoliciesManagementServiceQuery() {
    return useQuery({
        queryKey: ['listUserPoliciesManagementService'],
        queryFn: () => {
            const data: GetAllUserPoliciesData = {
                cspName: undefined,
                enabled: undefined,
            };
            return getAllUserPolicies(data);
        },
        refetchOnWindowFocus: false,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listUserPolicies, ListUserPoliciesData } from '../../../xpanse-api/generated';

export default function useListUserPoliciesManagementServiceQuery() {
    return useQuery({
        queryKey: ['listUserPoliciesManagementService'],
        queryFn: () => {
            const data: ListUserPoliciesData = {
                cspName: undefined,
                enabled: undefined,
            };
            return listUserPolicies(data);
        },
        refetchOnWindowFocus: false,
    });
}

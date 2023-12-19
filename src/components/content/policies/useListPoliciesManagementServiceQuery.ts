/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { UserPoliciesManagementService } from '../../../xpanse-api/generated';

export default function useListPoliciesManagementServiceQuery() {
    return useQuery({
        queryKey: ['listPoliciesManagementService'],
        queryFn: () => {
            return UserPoliciesManagementService.listUserPolicies();
        },
        refetchOnWindowFocus: false,
    });
}

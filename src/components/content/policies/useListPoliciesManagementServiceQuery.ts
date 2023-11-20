/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { PoliciesManagementService } from '../../../xpanse-api/generated';

export default function useListPoliciesManagementServiceQuery() {
    return useQuery({
        queryKey: ['listPoliciesManagementService'],
        queryFn: () => {
            return PoliciesManagementService.listPolicies(undefined, undefined);
        },
        refetchOnWindowFocus: false,
    });
}

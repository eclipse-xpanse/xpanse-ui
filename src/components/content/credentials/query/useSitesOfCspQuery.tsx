/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { csp, getSitesOfCsp, GetSitesOfCspData } from '../../../../xpanse-api/generated';

export const useSitesOfCspQuery = (currentCsp: csp | undefined) => {
    return useQuery({
        queryKey: ['sitesQuery', currentCsp],
        queryFn: () => {
            const data: GetSitesOfCspData = {
                cspName: currentCsp ?? csp.OPENSTACK_TESTLAB,
            };
            return getSitesOfCsp(data);
        },
        staleTime: 60000,
        enabled: currentCsp !== undefined,
    });
};

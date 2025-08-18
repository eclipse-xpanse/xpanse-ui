/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { Csp, getSitesOfCsp, GetSitesOfCspData } from '../../../../xpanse-api/generated';
import { Options } from '../../../../xpanse-api/generated/client';

export const useSitesOfCspQuery = (currentCsp: Csp | undefined) => {
    return useQuery({
        queryKey: ['sitesQuery', currentCsp],
        queryFn: async () => {
            const data: Options<GetSitesOfCspData> = {
                path: {
                    cspName: currentCsp ?? Csp.OPENSTACK_TESTLAB,
                },
            };
            const response = await getSitesOfCsp(data);
            return response.data;
        },
        staleTime: 60000,
        enabled: currentCsp !== undefined,
    });
};

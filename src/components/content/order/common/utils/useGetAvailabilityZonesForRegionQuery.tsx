/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceService, UserOrderableServiceVo } from '../../../../../xpanse-api/generated';

export default function useGetAvailabilityZonesForRegionQuery(csp: UserOrderableServiceVo.csp, region: string) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, region],
        queryFn: () => ServiceService.getAvailabilityZones(csp, region),
        gcTime: 60000,
        staleTime: Infinity,
    });
}

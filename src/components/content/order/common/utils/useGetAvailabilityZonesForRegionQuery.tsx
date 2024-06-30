/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { csp, getAvailabilityZones, type GetAvailabilityZonesData } from '../../../../../xpanse-api/generated';

export default function useGetAvailabilityZonesForRegionQuery(csp: csp, region: string) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, region],
        queryFn: () => {
            const data: GetAvailabilityZonesData = {
                cspName: csp,
                regionName: region,
            };
            return getAvailabilityZones(data);
        },
        gcTime: 60000,
        staleTime: Infinity,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getAvailabilityZones,
    GetAvailabilityZonesData,
    UserOrderableServiceVo,
} from '../../../../../xpanse-api/generated';

export default function useGetAvailabilityZonesForRegionQuery(csp: UserOrderableServiceVo['csp'], region: string) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, region],
        queryFn: () => {
            const data: GetAvailabilityZonesData = {
                cspName: csp,
                regionName: region,
                serviceId: '',
            };
            return getAvailabilityZones(data);
        },
        gcTime: 60000,
        staleTime: Infinity,
    });
}

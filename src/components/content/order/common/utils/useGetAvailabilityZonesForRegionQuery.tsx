/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { csp, getAvailabilityZones, type GetAvailabilityZonesData, Region } from '../../../../../xpanse-api/generated';

export default function useGetAvailabilityZonesForRegionQuery(
    csp: csp,
    region: Region,
    selectedServiceTemplateId: string
) {
    return useQuery({
        queryKey: ['availabilityZonesForRegionQuery', csp, region, selectedServiceTemplateId],
        queryFn: () => {
            const data: GetAvailabilityZonesData = {
                cspName: csp,
                siteName: region.site,
                regionName: region.name,
                serviceTemplateId: selectedServiceTemplateId,
            };
            return getAvailabilityZones(data);
        },
        gcTime: 60000,
        staleTime: Infinity,
    });
}

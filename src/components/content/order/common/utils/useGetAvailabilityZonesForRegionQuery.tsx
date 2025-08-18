/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    Csp,
    getAvailabilityZones,
    type GetAvailabilityZonesData,
    Options,
    Region,
} from '../../../../../xpanse-api/generated';

export default function useGetAvailabilityZonesForRegionQuery(
    csp: Csp,
    region: Region,
    selectedServiceTemplateId: string
) {
    return useQuery({
        queryKey: ['availabilityZonesForRegionQuery', csp, region, selectedServiceTemplateId],
        queryFn: async () => {
            const request: Options<GetAvailabilityZonesData> = {
                query: {
                    cspName: csp,
                    siteName: region.site,
                    regionName: region.name,
                    serviceTemplateId: selectedServiceTemplateId,
                },
            };
            const response = await getAvailabilityZones(request);
            return response.data;
        },
        gcTime: 60000,
        staleTime: Infinity,
    });
}

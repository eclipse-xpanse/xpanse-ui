/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    billingMode,
    FlavorPriceResult,
    getPricesByService,
    GetPricesByServiceData,
    ServiceFlavor,
} from '../../../../xpanse-api/generated';
import { getFlavorWithPricesList } from '../formDataHelpers/flavorHelper.ts';

export default function useGetServicePricesQuery(
    serviceTemplateId: string,
    regionName: string,
    siteName: string,
    billingMode: string,
    flavorList?: ServiceFlavor[]
) {
    return useQuery({
        queryKey: ['getServicePricesQuery', serviceTemplateId, regionName, siteName, billingMode, flavorList],
        queryFn: async () => {
            const data: GetPricesByServiceData = {
                serviceTemplateId: serviceTemplateId,
                regionName: regionName,
                siteName: siteName,
                billingMode: billingMode as billingMode,
            };
            const prices: FlavorPriceResult[] = await getPricesByService(data);
            return getFlavorWithPricesList(prices, flavorList);
        },
        enabled: serviceTemplateId.length > 0,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

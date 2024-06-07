/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    DeployRequest,
    FlavorPriceResult,
    ServiceFlavor,
    ServicePricesService,
} from '../../../../xpanse-api/generated';
import { getFlavorWithPricesList } from '../formDataHelpers/flavorHelper.ts';

export default function useGetServicePricesQuery(
    serviceTemplateId: string,
    region: string,
    billingMode: DeployRequest.billingMode,
    flavorList?: ServiceFlavor[]
) {
    return useQuery({
        queryKey: ['getServicePricesQuery', serviceTemplateId, region, billingMode, flavorList],
        queryFn: async () => {
            const prices: FlavorPriceResult[] = await ServicePricesService.getPricesByService(
                serviceTemplateId,
                region,
                billingMode
            );
            return getFlavorWithPricesList(prices, flavorList);
        },
        enabled: serviceTemplateId.length > 0,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    BillingMode,
    getPricesByService,
    GetPricesByServiceData,
    Options,
    ServiceFlavor,
} from '../../../../xpanse-api/generated';
import { getFlavorWithPricesList } from '../formDataHelpers/flavorHelper.ts';

export default function useGetServicePricesQuery(
    serviceTemplateId: string,
    regionName: string,
    siteName: string,
    billingMode: BillingMode,
    flavorList?: ServiceFlavor[]
) {
    return useQuery({
        queryKey: ['getServicePricesQuery', serviceTemplateId, regionName, siteName, billingMode, flavorList],
        queryFn: async () => {
            const request: Options<GetPricesByServiceData> = {
                path: {
                    serviceTemplateId: serviceTemplateId,
                    regionName: regionName,
                    siteName: siteName,
                    billingMode: billingMode,
                },
            };
            const response = await getPricesByService(request);
            return getFlavorWithPricesList(response.data ?? [], flavorList);
        },
        enabled: serviceTemplateId.length > 0,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}

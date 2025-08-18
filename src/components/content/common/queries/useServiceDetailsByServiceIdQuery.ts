/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getSelfHostedServiceDetailsById,
    GetSelfHostedServiceDetailsByIdData,
    getVendorHostedServiceDetailsById,
    GetVendorHostedServiceDetailsByIdData,
    Options,
    OrderStatus,
    ServiceHostingType,
} from '../../../../xpanse-api/generated';

const GET_SERVICE_DETAILS_QUERY_ID = 'getServiceDetailsById';

export function useServiceDetailsByServiceIdQuery(
    serviceId: string | undefined,
    currentServiceHostingType: ServiceHostingType,
    currentServiceOrderOrderStatus: string | undefined
) {
    return useQuery({
        queryKey: [GET_SERVICE_DETAILS_QUERY_ID, serviceId, currentServiceHostingType],
        queryFn: async () => {
            if (currentServiceHostingType === ServiceHostingType.SELF) {
                const request: Options<GetSelfHostedServiceDetailsByIdData> = {
                    path: {
                        serviceId: serviceId ?? '',
                    },
                };
                const response = await getSelfHostedServiceDetailsById(request);
                return response.data;
            } else {
                const request: Options<GetVendorHostedServiceDetailsByIdData> = {
                    path: {
                        serviceId: serviceId ?? '',
                    },
                };
                const response = await getVendorHostedServiceDetailsById(request);
                return response.data;
            }
        },
        enabled:
            serviceId !== undefined &&
            (currentServiceOrderOrderStatus === OrderStatus.SUCCESSFUL ||
                currentServiceOrderOrderStatus === OrderStatus.FAILED),
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function getQueryKeyForServiceDetailsByServiceIdQuery(
    serviceId: string,
    currentServiceHostingType: string
): string[] {
    return [GET_SERVICE_DETAILS_QUERY_ID, serviceId, currentServiceHostingType];
}

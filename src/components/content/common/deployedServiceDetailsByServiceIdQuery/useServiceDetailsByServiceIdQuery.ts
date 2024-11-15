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
    serviceHostingType,
    taskStatus,
} from '../../../../xpanse-api/generated';

export function useServiceDetailsByServiceIdQuery(
    serviceId: string | undefined,
    currentServiceHostingType: string,
    currentMigrationTaskStatus: string | undefined
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, currentServiceHostingType],
        queryFn: () => {
            if (currentServiceHostingType === serviceHostingType.SELF.toString()) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                return getVendorHostedServiceDetailsById(data);
            }
        },
        enabled:
            serviceId !== undefined &&
            (currentMigrationTaskStatus === taskStatus.SUCCESSFUL || currentMigrationTaskStatus === taskStatus.FAILED),
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

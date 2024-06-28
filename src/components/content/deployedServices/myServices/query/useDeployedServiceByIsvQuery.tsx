/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    category,
    csp,
    listDeployedServicesOfIsv,
    type ListDeployedServicesOfIsvData,
} from '../../../../../xpanse-api/generated';

export default function useDeployedServicesByIsvQuery(
    categoryName: string,
    cspName: string,
    serviceName: string,
    serviceVersion: string
) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', categoryName, cspName, serviceName, serviceVersion],
        queryFn: () => {
            const data: ListDeployedServicesOfIsvData = {
                categoryName: categoryName as category,
                cspName: cspName as csp,
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                serviceState: undefined,
            };
            return listDeployedServicesOfIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

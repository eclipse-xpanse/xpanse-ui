/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DeployedService, ServiceService } from '../../../../../xpanse-api/generated';

export default function useDeployedServicesByIsvQuery(
    categoryName: DeployedService.category,

    cspName: DeployedService.csp,
    serviceName: string,
    serviceVersion: string
) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', categoryName, cspName, serviceName, serviceVersion],
        queryFn: () =>
            ServiceService.listDeployedServicesOfIsv(categoryName, cspName, serviceName, serviceVersion, undefined),
        refetchOnWindowFocus: false,
    });
}

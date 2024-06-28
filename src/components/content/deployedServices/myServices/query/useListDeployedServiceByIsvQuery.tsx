/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listDeployedServicesOfIsv, ListDeployedServicesOfIsvData } from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesByIsvQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv'],
        queryFn: () => {
            const data: ListDeployedServicesOfIsvData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceState: undefined,
            };
            return listDeployedServicesOfIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

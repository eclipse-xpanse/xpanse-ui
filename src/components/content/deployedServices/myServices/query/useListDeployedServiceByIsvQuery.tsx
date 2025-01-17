/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllDeployedServicesByIsv, GetAllDeployedServicesByIsvData } from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesByIsvQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv'],
        queryFn: () => {
            const data: GetAllDeployedServicesByIsvData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceState: undefined,
            };
            return getAllDeployedServicesByIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

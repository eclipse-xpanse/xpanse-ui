/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listDeployedServicesDetails, ListDeployedServicesDetailsData } from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesDetailsQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesDetails'],
        queryFn: () => {
            const data: ListDeployedServicesDetailsData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceState: undefined,
            };
            return listDeployedServicesDetails(data);
        },
        refetchOnWindowFocus: false,
    });
}

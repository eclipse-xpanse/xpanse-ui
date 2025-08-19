/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getAllDeployedServicesWithDetails,
    GetAllDeployedServicesWithDetailsData,
} from '../../../../../xpanse-api/generated';
import { Options } from '../../../../../xpanse-api/generated/client';

export default function useListDeployedServicesDetailsQuery() {
    return useQuery({
        queryKey: getListDeployedServicesDetailsQueryKey(),
        queryFn: async () => {
            const request: Options<GetAllDeployedServicesWithDetailsData> = {
                query: {
                    categoryName: undefined,
                    cspName: undefined,
                    serviceName: undefined,
                    serviceVersion: undefined,
                    serviceState: undefined,
                },
            };
            const response = await getAllDeployedServicesWithDetails(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function getListDeployedServicesDetailsQueryKey(): string[] {
    return ['listDeployedServicesDetails'];
}

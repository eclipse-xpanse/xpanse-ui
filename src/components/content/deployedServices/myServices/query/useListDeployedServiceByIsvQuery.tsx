/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getAllDeployedServicesByIsv,
    type GetAllDeployedServicesByIsvData,
    Options,
} from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesByIsvQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv'],
        queryFn: async () => {
            const request: Options<GetAllDeployedServicesByIsvData> = {
                query: {
                    categoryName: undefined,
                    cspName: undefined,
                    serviceName: undefined,
                    serviceVersion: undefined,
                    serviceState: undefined,
                },
            };
            const response = await getAllDeployedServicesByIsv(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

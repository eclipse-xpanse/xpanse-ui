/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getServiceDetailsByIdForIsv,
    GetServiceDetailsByIdForIsvData,
    Options,
} from '../../../../../xpanse-api/generated';

export default function useGetServiceDetailsByIdForIsvQuery(serviceId: string) {
    return useQuery({
        queryKey: ['getServiceDetailsByIdForIsv', serviceId],
        queryFn: async () => {
            const data: Options<GetServiceDetailsByIdForIsvData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await getServiceDetailsByIdForIsv(data);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

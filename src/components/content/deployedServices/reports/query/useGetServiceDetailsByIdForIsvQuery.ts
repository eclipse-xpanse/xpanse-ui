/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getServiceDetailsByIdForIsv, GetServiceDetailsByIdForIsvData } from '../../../../../xpanse-api/generated';

export default function useGetServiceDetailsByIdForIsvQuery(serviceId: string) {
    return useQuery({
        queryKey: ['getServiceDetailsByIdForIsv', serviceId],
        queryFn: () => {
            const data: GetServiceDetailsByIdForIsvData = {
                serviceId: serviceId,
            };
            return getServiceDetailsByIdForIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

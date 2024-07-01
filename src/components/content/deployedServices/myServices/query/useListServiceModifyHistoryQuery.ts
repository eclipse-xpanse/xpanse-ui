/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listServiceModificationAudits, ListServiceModificationAuditsData } from '../../../../../xpanse-api/generated';

export default function useListServiceModifyHistoryQuery(serviceId: string) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', serviceId],
        queryFn: () => {
            const data: ListServiceModificationAuditsData = {
                serviceId: serviceId,
                taskStatus: undefined,
            };
            return listServiceModificationAudits(data);
        },
        refetchOnWindowFocus: false,
    });
}

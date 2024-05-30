/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceModificationService } from '../../../../../xpanse-api/generated';

export default function useListServiceModifyHistoryQuery(serviceId: string) {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv', serviceId],
        queryFn: () => ServiceModificationService.listServiceModificationAudits(serviceId, undefined),
        refetchOnWindowFocus: false,
    });
}

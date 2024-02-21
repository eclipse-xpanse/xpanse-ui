/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceCatalogService } from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetailsQuery(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetails', serviceTemplateId],
        queryFn: () => ServiceCatalogService.getOrderableServiceDetails(serviceTemplateId ?? ''),
        refetchOnWindowFocus: false,
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

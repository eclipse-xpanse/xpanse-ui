/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceCatalogService, ServiceVo } from '../../../../xpanse-api/generated';

export default function UserOrderableServicesQuery(category: ServiceVo.category, serviceName: string | undefined) {
    return useQuery({
        queryKey: ['orderableServices', category, serviceName],
        queryFn: () => ServiceCatalogService.listOrderableServices(category, undefined, serviceName),
        refetchOnWindowFocus: false,
    });
}

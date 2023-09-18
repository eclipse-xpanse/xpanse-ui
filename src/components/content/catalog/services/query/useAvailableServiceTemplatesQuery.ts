/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceVendorService, ServiceVo } from '../../../../../xpanse-api/generated';

export function useAvailableServiceTemplatesQuery(category: ServiceVo.category) {
    return useQuery({
        queryKey: getQueryKey(category),
        queryFn: () => ServiceVendorService.listServiceTemplates(category),
        refetchOnWindowFocus: false,
    });
}

export function getQueryKey(category: ServiceVo.category): string[] {
    return ['catalog', category];
}

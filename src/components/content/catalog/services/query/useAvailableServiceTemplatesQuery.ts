/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DeployedService, ServiceVendorService } from '../../../../../xpanse-api/generated';

export function useAvailableServiceTemplatesQuery(category: DeployedService.category) {
    return useQuery({
        queryKey: getQueryKey(category),
        queryFn: () => ServiceVendorService.listServiceTemplates(category),
        refetchOnWindowFocus: false,
    });
}

export function getQueryKey(category: DeployedService.category): string[] {
    return ['catalog', category];
}

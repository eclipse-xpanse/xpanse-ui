/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    listServiceTemplates,
    ListServiceTemplatesData,
    ServiceTemplateDetailVo,
} from '../../../../../xpanse-api/generated';

export function useAvailableServiceTemplatesQuery(category: ServiceTemplateDetailVo['category']) {
    return useQuery({
        queryKey: getQueryKey(category),
        queryFn: () => {
            const data: ListServiceTemplatesData = {
                categoryName: category,
            };
            return listServiceTemplates(data);
        },
        refetchOnWindowFocus: false,
    });
}

export function getQueryKey(category: ServiceTemplateDetailVo['category']): string[] {
    return ['catalog', category];
}

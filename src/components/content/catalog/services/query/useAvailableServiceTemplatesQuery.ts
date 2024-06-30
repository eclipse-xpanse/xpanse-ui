/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { category, listServiceTemplates, ListServiceTemplatesData } from '../../../../../xpanse-api/generated';

export function useAvailableServiceTemplatesQuery(currentCategory: category) {
    return useQuery({
        queryKey: getQueryKey(currentCategory),
        queryFn: () => {
            const data: ListServiceTemplatesData = {
                categoryName: currentCategory,
            };
            return listServiceTemplates(data);
        },
        refetchOnWindowFocus: false,
    });
}

export function getQueryKey(category: category): string[] {
    return ['catalog', category.toString()];
}

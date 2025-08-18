/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    Category,
    getAllServiceTemplatesByIsv,
    GetAllServiceTemplatesByIsvData,
    Options,
} from '../../../../../xpanse-api/generated';

export function useAvailableServiceTemplatesQuery(currentCategory: Category) {
    return useQuery({
        queryKey: getQueryKey(currentCategory),
        queryFn: async () => {
            const data: Options<GetAllServiceTemplatesByIsvData> = {
                query: {
                    categoryName: currentCategory,
                },
            };
            const response = await getAllServiceTemplatesByIsv(data);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

export function getQueryKey(category: Category): string[] {
    return ['catalog', category];
}

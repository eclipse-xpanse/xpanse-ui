/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    category,
    getAllServiceTemplatesByIsv,
    GetAllServiceTemplatesByIsvData,
} from '../../../../../xpanse-api/generated';

export function useAvailableServiceTemplatesQuery(currentCategory: category) {
    return useQuery({
        queryKey: getQueryKey(currentCategory),
        queryFn: () => {
            const data: GetAllServiceTemplatesByIsvData = {
                categoryName: currentCategory,
            };
            return getAllServiceTemplatesByIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

export function getQueryKey(category: category): string[] {
    return ['catalog', category];
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getActiveCsps } from '../../../../xpanse-api/generated';

export const useActiveCspsQuery = () => {
    return useQuery({
        queryKey: ['getActiveCspsQuery'],
        queryFn: async () => {
            const response = await getActiveCsps();
            return response.data;
        },
        staleTime: 60000,
    });
};

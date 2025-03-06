/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getActiveCsps } from '../../../../xpanse-api/generated';

export const useActiveCspsQuery = () => {
    return useQuery({
        queryKey: ['getActiveCspsQuery'],
        queryFn: () => {
            return getActiveCsps();
        },
        staleTime: 60000,
    });
};

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getServiceDetailsByIdForIsv, GetServiceDetailsByIdForIsvData } from '../../../../../xpanse-api/generated';

export default function useGetServiceDetailsByIdForIsvQuery(id: string) {
    return useQuery({
        queryKey: ['getServiceDetailsByIdForIsv', id],
        queryFn: () => {
            const data: GetServiceDetailsByIdForIsvData = {
                id: id,
            };
            return getServiceDetailsByIdForIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

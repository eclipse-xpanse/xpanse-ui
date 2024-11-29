/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getOrderableServiceDetailsById,
    type GetOrderableServiceDetailsByIdData,
} from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetailsQuery(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetailsById', serviceTemplateId],
        queryFn: () => {
            const data: GetOrderableServiceDetailsByIdData = {
                id: serviceTemplateId ?? '',
            };
            return getOrderableServiceDetailsById(data);
        },
        refetchOnWindowFocus: false,
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

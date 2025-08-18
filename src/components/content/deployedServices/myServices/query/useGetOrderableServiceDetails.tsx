/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getOrderableServiceDetailsById,
    GetOrderableServiceDetailsByIdData,
    Options,
} from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetails(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetailsById', serviceTemplateId],
        queryFn: async () => {
            const data: Options<GetOrderableServiceDetailsByIdData> = {
                path: {
                    serviceTemplateId: serviceTemplateId ?? '',
                },
            };
            const response = await getOrderableServiceDetailsById(data);
            return response.data;
        },
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

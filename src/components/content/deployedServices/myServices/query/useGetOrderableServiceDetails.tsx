/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getOrderableServiceDetailsById,
    GetOrderableServiceDetailsByIdData,
} from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetails(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetailsById', serviceTemplateId],
        queryFn: () => {
            const data: GetOrderableServiceDetailsByIdData = {
                serviceTemplateId: serviceTemplateId ?? '',
            };
            return getOrderableServiceDetailsById(data);
        },
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

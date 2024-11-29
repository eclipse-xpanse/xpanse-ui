/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DetailsData, getOrderableServiceDetailsById } from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetails(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetailsById', serviceTemplateId],
        queryFn: () => {
            const data: DetailsData = {
                id: serviceTemplateId ?? '',
            };
            return getOrderableServiceDetailsById(data);
        },
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

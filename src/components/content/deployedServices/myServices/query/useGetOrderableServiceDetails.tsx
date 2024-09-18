/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DetailsData, getOrderableServiceDetails } from '../../../../../xpanse-api/generated';

export default function useGetOrderableServiceDetails(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getOrderableServiceDetails', serviceTemplateId],
        queryFn: () => {
            const data: DetailsData = {
                id: serviceTemplateId ?? '',
            };
            return getOrderableServiceDetails(data);
        },
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

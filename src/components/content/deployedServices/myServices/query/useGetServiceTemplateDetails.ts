/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { details, DetailsData } from '../../../../../xpanse-api/generated';

export default function useGetServiceTemplateDetails(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getServiceTemplateDetails', serviceTemplateId],
        queryFn: () => {
            const data: DetailsData = {
                id: serviceTemplateId ?? '',
            };
            return details(data);
        },
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}

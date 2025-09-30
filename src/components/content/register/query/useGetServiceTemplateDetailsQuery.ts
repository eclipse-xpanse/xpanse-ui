/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getServiceTemplateDetailsById,
    type GetServiceTemplateDetailsData,
    Options,
} from '../../../../xpanse-api/generated';

export function useGetServiceTemplateDetailsQuery(serviceTemplateId: string) {
    return useQuery({
        queryKey: [serviceTemplateId],
        queryFn: async () => {
            const request: Options<GetServiceTemplateDetailsData> = {
                path: {
                    serviceTemplateId: serviceTemplateId,
                },
            };
            const response = await getServiceTemplateDetailsById(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
        enabled: serviceTemplateId !== '',
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllServiceTemplates, type GetAllServiceTemplatesData, Options } from '../../../../xpanse-api/generated';

export default function useListAllServiceTemplatesQuery() {
    return useQuery({
        queryKey: ['listManagedServiceTemplatesForCspUser'],
        queryFn: async () => {
            const request: Options<GetAllServiceTemplatesData> = {
                query: {
                    categoryName: undefined,
                    serviceName: undefined,
                    serviceVersion: undefined,
                    serviceHostingType: undefined,
                    serviceTemplateRegistrationState: undefined,
                },
            };
            const response = await getAllServiceTemplates(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

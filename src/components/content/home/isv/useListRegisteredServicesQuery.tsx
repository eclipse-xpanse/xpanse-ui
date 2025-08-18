/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getAllServiceTemplatesByIsv,
    GetAllServiceTemplatesByIsvData,
    Options,
} from '../../../../xpanse-api/generated';

export default function useListRegisteredServicesQuery() {
    return useQuery({
        queryKey: ['getAllServiceTemplatesByIsv'],
        queryFn: async () => {
            const request: Options<GetAllServiceTemplatesByIsvData> = {
                query: {
                    categoryName: undefined,
                    cspName: undefined,
                    serviceName: undefined,
                    serviceVersion: undefined,
                    serviceHostingType: undefined,
                    serviceTemplateRegistrationState: undefined,
                },
            };
            const response = await getAllServiceTemplatesByIsv(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
    });
}

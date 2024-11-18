/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { listServiceTemplates, ListServiceTemplatesData } from '../../../../xpanse-api/generated';

export default function useListRegisteredServicesQuery() {
    return useQuery({
        queryKey: ['listRegisteredServicesByIsv'],
        queryFn: () => {
            const data: ListServiceTemplatesData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceHostingType: undefined,
                serviceTemplateRegistrationState: undefined,
            };
            return listServiceTemplates(data);
        },
        refetchOnWindowFocus: false,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllServiceTemplatesByIsv, GetAllServiceTemplatesByIsvData } from '../../../../xpanse-api/generated';

export default function useListRegisteredServicesQuery() {
    return useQuery({
        queryKey: ['getAllServiceTemplatesByIsv'],
        queryFn: () => {
            const data: GetAllServiceTemplatesByIsvData = {
                categoryName: undefined,
                cspName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceHostingType: undefined,
                serviceTemplateRegistrationState: undefined,
            };
            return getAllServiceTemplatesByIsv(data);
        },
        refetchOnWindowFocus: false,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getAllServiceTemplates, type GetAllServiceTemplatesData } from '../../../../xpanse-api/generated';

export default function useListAllServiceTemplatesQuery() {
    return useQuery({
        queryKey: ['listManagedServiceTemplatesForCspUser'],
        queryFn: () => {
            const data: GetAllServiceTemplatesData = {
                categoryName: undefined,
                serviceName: undefined,
                serviceVersion: undefined,
                serviceHostingType: undefined,
                serviceTemplateRegistrationState: undefined,
            };
            return getAllServiceTemplates(data);
        },
        refetchOnWindowFocus: false,
    });
}

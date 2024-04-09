/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { CloudServiceProviderService } from '../../../../xpanse-api/generated';

export default function useListAllServiceTemplatesQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesDetails'],
        queryFn: () =>
            CloudServiceProviderService.listManagedServiceTemplates(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ),
        refetchOnWindowFocus: false,
    });
}

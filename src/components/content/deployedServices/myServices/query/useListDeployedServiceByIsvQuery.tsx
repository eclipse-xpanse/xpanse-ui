/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceService } from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesByIsvQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesByIsv'],
        queryFn: () => ServiceService.listDeployedServicesOfIsv(undefined, undefined, undefined, undefined, undefined),
        refetchOnWindowFocus: false,
    });
}

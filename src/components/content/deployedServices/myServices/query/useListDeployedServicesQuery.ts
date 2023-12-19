/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceService } from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesQuery() {
    return useQuery({
        queryKey: ['listDeployedServices'],
        queryFn: () => ServiceService.listDeployedServices(undefined, undefined, undefined, undefined, undefined),
        refetchOnWindowFocus: false,
    });
}

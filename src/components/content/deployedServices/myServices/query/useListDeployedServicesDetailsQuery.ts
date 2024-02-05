/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { ServiceService } from '../../../../../xpanse-api/generated';

export default function useListDeployedServicesDetailsQuery() {
    return useQuery({
        queryKey: ['listDeployedServicesDetails'],
        queryFn: () =>
            ServiceService.listDeployedServicesDetails(undefined, undefined, undefined, undefined, undefined),
        refetchOnWindowFocus: false,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { DeployRequest, ServiceService } from '../../../../../xpanse-api/generated';

export default function useAvailabilityZonesVariableQuery(csp: DeployRequest.csp, region: string) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, region],
        queryFn: () => ServiceService.getAvailabilityZones(csp, region),
    });
}

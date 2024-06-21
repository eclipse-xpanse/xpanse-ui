/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    AutoFill,
    DeployRequest,
    getExistingResourceNamesWithKind,
    GetExistingResourceNamesWithKindData,
} from '../../../../xpanse-api/generated';

export default function useAutoFillDeployVariableQuery(
    csp: DeployRequest['csp'],
    region: string,
    kind: AutoFill['deployResourceKind'] | undefined
) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, region, kind],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        queryFn: () => {
            const data: GetExistingResourceNamesWithKindData = {
                csp: csp,
                region: region,
                deployResourceKind: kind ?? 'vm',
            };
            return getExistingResourceNamesWithKind(data);
        },
        enabled: kind !== undefined,
    });
}

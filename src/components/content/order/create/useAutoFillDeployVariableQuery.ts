/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    csp,
    deployResourceKind,
    getExistingResourceNamesWithKind,
    GetExistingResourceNamesWithKindData,
} from '../../../../xpanse-api/generated';

export default function useAutoFillDeployVariableQuery(csp: string, region: string, kind: string) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, region, kind],
        queryFn: () => {
            const data: GetExistingResourceNamesWithKindData = {
                csp: csp as csp,
                region: region,
                deployResourceKind: kind as deployResourceKind,
            };
            return getExistingResourceNamesWithKind(data);
        },
        enabled: kind.length > 0,
    });
}

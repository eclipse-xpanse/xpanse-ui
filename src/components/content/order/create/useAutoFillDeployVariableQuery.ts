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

export default function useAutoFillDeployVariableQuery(
    csp: csp,
    site: string,
    region: string,
    kind: deployResourceKind
) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, site, kind, region],
        queryFn: () => {
            const data: GetExistingResourceNamesWithKindData = {
                csp: csp,
                siteName: site,
                regionName: region,
                deployResourceKind: kind,
            };
            return getExistingResourceNamesWithKind(data);
        },
        enabled: kind.length > 0,
    });
}

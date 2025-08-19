/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    Csp,
    DeployResourceKind,
    getExistingResourceNamesWithKind,
    GetExistingResourceNamesWithKindData,
    Options,
} from '../../../../xpanse-api/generated';

export default function useAutoFillDeployVariableQuery(
    csp: Csp,
    site: string,
    region: string,
    kind: DeployResourceKind
) {
    return useQuery({
        queryKey: ['getExistingResourceNamesWithKind', csp, site, kind, region],
        queryFn: async () => {
            const request: Options<GetExistingResourceNamesWithKindData> = {
                query: {
                    csp: csp,
                    siteName: site,
                    regionName: region,
                },
                path: {
                    deployResourceKind: kind,
                },
            };
            const response = await getExistingResourceNamesWithKind(request);
            return response.data;
        },
        enabled: kind.length > 0,
    });
}

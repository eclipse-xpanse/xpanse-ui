/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { Csp, getCredentialTypes, GetCredentialTypesData } from '../../../../xpanse-api/generated';
import { Options } from '../../../../xpanse-api/generated/client';

export const useCredentialTypesQuery = (currentCsp: Csp | undefined) => {
    return useQuery({
        queryKey: ['credentialTypesQuery', currentCsp],
        queryFn: async () => {
            const request: Options<GetCredentialTypesData> = { query: { cspName: currentCsp } };
            const response = await getCredentialTypes(request);
            return response.data;
        },
        staleTime: 60000,
        enabled: currentCsp !== undefined,
    });
};

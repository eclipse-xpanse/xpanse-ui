/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { csp, getCredentialTypes, type GetCredentialTypesData } from '../../../../xpanse-api/generated';

export const useCredentialTypesQuery = (currentCsp: csp | undefined) => {
    return useQuery({
        queryKey: ['credentialTypesQuery', currentCsp],
        queryFn: () => {
            const data: GetCredentialTypesData = {
                cspName: currentCsp,
            };
            return getCredentialTypes(data);
        },
        staleTime: 60000,
        enabled: currentCsp !== undefined,
    });
};

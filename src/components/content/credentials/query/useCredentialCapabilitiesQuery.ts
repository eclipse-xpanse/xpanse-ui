/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    CredentialType,
    Csp,
    getCredentialCapabilities,
    GetCredentialCapabilitiesData,
} from '../../../../xpanse-api/generated';
import { Options } from '../../../../xpanse-api/generated/client';

export const useCredentialCapabilitiesQuery = (
    currentCsp: Csp | undefined,
    currentType: CredentialType | undefined
) => {
    return useQuery({
        queryKey: ['credentialCapabilitiesQuery', currentCsp, currentType],
        queryFn: async () => {
            const request: Options<GetCredentialCapabilitiesData> = {
                query: {
                    cspName: currentCsp ?? Csp.OPENSTACK_TESTLAB,
                    type: currentType,
                },
            };
            const response = await getCredentialCapabilities(request);
            return response.data;
        },
        staleTime: 60000,
        enabled: currentType !== undefined,
    });
};

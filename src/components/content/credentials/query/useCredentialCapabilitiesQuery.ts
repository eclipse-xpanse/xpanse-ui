/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    credentialType,
    csp,
    getCredentialCapabilities,
    type GetCredentialCapabilitiesData,
} from '../../../../xpanse-api/generated';

export const useCredentialCapabilitiesQuery = (
    currentCsp: csp | undefined,
    currentType: credentialType | undefined
) => {
    return useQuery({
        queryKey: ['credentialCapabilitiesQuery', currentCsp, currentType],
        queryFn: () => {
            const data: GetCredentialCapabilitiesData = {
                cspName: currentCsp ?? csp.OPENSTACK_TESTLAB,
                type: currentType,
            };
            return getCredentialCapabilities(data);
        },
        staleTime: 60000,
        enabled: currentType !== undefined,
    });
};

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getIsvCloudCredentials, getUserCloudCredentials } from '../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../layouts/header/useCurrentRoleStore';

export default function useCredentialsListQuery() {
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    return useQuery({
        queryKey: getCredentialsListQueryKey(currentRole),
        queryFn: () => {
            if (currentRole === 'user') {
                return getUserCloudCredentials();
            } else {
                return getIsvCloudCredentials();
            }
        },
        staleTime: 60000,
    });
}

export function getCredentialsListQueryKey(currentRole: string | undefined): (string | undefined)[] {
    return ['credentialsQuery', currentRole];
}

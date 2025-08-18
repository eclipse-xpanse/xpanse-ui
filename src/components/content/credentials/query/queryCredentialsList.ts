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
        queryFn: async () => {
            if (currentRole === 'user') {
                const response = await getUserCloudCredentials();
                return response.data;
            } else {
                const response = await getIsvCloudCredentials();
                return response.data;
            }
        },
        staleTime: 60000,
    });
}

export function getCredentialsListQueryKey(currentRole: string | undefined): (string | undefined)[] {
    return ['credentialsQuery', currentRole];
}

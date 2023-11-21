/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { CredentialsManagementService } from '../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../layouts/header/useCurrentRoleStore';

export default function useCredentialsListQuery() {
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    return useQuery({
        queryKey: ['credentialsQuery', currentRole],
        queryFn: () => {
            if (currentRole === 'user') {
                return CredentialsManagementService.getUserCloudCredentials();
            } else {
                return CredentialsManagementService.getIsvCloudCredentials();
            }
        },
        staleTime: 60000,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    IsvCloudCredentialsManagementService,
    UserCloudCredentialsManagementService,
} from '../../../../xpanse-api/generated';
import { useCurrentUserRoleStore } from '../../../layouts/header/useCurrentRoleStore';

export default function useCredentialsListQuery() {
    const currentRole: string | undefined = useCurrentUserRoleStore((state) => state.currentUserRole);
    return useQuery({
        queryKey: ['credentialsQuery', currentRole],
        queryFn: () => {
            if (currentRole === 'user') {
                return UserCloudCredentialsManagementService.getUserCloudCredentials();
            } else {
                return IsvCloudCredentialsManagementService.getIsvCloudCredentials();
            }
        },
        staleTime: 60000,
    });
}

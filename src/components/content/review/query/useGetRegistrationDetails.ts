/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { CloudServiceProviderService } from '../../../../xpanse-api/generated';

export default function useGetRegistrationDetails(id: string | undefined) {
    return useQuery({
        queryKey: ['getRegistrationDetails', id],
        queryFn: () => {
            return CloudServiceProviderService.getRegistrationDetails(id ?? '');
        },
        enabled: id !== undefined,
        refetchOnWindowFocus: false,
    });
}

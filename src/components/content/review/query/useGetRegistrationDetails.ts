/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import { getRegistrationDetails, GetRegistrationDetailsData } from '../../../../xpanse-api/generated';

export default function useGetRegistrationDetails(id: string | undefined) {
    return useQuery({
        queryKey: ['getRegistrationDetails', id],
        queryFn: () => {
            const data: GetRegistrationDetailsData = {
                id: id ?? '',
            };
            return getRegistrationDetails(data);
        },
        enabled: id !== undefined,
        refetchOnWindowFocus: false,
    });
}

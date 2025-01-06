/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getRequestedServiceTemplateByRequestId,
    GetRequestedServiceTemplateByRequestIdData,
} from '../../../../../xpanse-api/generated';

export default function useRequestedServiceTemplateQuery(requestId: string | undefined) {
    return useQuery({
        queryKey: ['getRequestedServiceTemplateByRequestId', requestId],
        queryFn: () => {
            const data: GetRequestedServiceTemplateByRequestIdData = {
                requestId: requestId ?? '',
            };
            return getRequestedServiceTemplateByRequestId(data);
        },
        refetchOnWindowFocus: false,
        enabled: requestId !== undefined,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getRequestedServiceTemplateByRequestId,
    GetRequestedServiceTemplateByRequestIdData,
    Options,
} from '../../../../../xpanse-api/generated';

export default function useRequestedServiceTemplateQuery(requestId: string | undefined) {
    return useQuery({
        queryKey: ['getRequestedServiceTemplateByRequestId', requestId],
        queryFn: async () => {
            const request: Options<GetRequestedServiceTemplateByRequestIdData> = {
                path: {
                    requestId: requestId ?? '',
                },
            };
            const response = await getRequestedServiceTemplateByRequestId(request);
            return response.data;
        },
        refetchOnWindowFocus: false,
        enabled: requestId !== undefined,
    });
}

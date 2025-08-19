/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    cancelServiceTemplateRequestByRequestId,
    type CancelServiceTemplateRequestByRequestIdData,
    Options,
} from '../../../../../xpanse-api/generated';

const cancelKey: string = 'cancelTemplateHistoryRequest';
export function useCancelServiceTemplateRequest() {
    return useMutation({
        mutationKey: [cancelKey],
        mutationFn: async (requestId: string) => {
            const request: Options<CancelServiceTemplateRequestByRequestIdData> = {
                path: {
                    requestId: requestId,
                },
            };
            const response = await cancelServiceTemplateRequestByRequestId(request);
            return response.data;
        },
        gcTime: 0,
    });
}

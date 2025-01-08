/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    cancelServiceTemplateRequestByRequestId,
    CancelServiceTemplateRequestByRequestIdData,
} from '../../../../../xpanse-api/generated';

const cancelKey: string = 'cancelTemplateHistoryRequest';
export function useCancelServiceTemplateRequest() {
    return useMutation({
        mutationKey: [cancelKey],
        mutationFn: (requestId: string) => {
            const data: CancelServiceTemplateRequestByRequestIdData = {
                requestId: requestId,
            };
            return cancelServiceTemplateRequestByRequestId(data);
        },
        gcTime: 0,
    });
}

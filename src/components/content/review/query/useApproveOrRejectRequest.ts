/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    ReviewServiceTemplateRequest,
    reviewServiceTemplateRequest,
    ReviewServiceTemplateRequestData,
} from '../../../../xpanse-api/generated';

const reviewKey: string = 'review';

export interface ApproveOrRejectRequestParams {
    id: string;
    reviewServiceTemplateRequest: ReviewServiceTemplateRequest;
}

export default function useApproveOrRejectRequest(id: string) {
    return useMutation({
        mutationKey: [id, reviewKey],
        mutationFn: (requestParams: ApproveOrRejectRequestParams) => {
            const data: ReviewServiceTemplateRequestData = {
                requestId: requestParams.id,
                requestBody: requestParams.reviewServiceTemplateRequest,
            };
            return reviewServiceTemplateRequest(data);
        },
    });
}

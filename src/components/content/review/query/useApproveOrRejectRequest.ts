/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    Options,
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
        mutationFn: async (requestParams: ApproveOrRejectRequestParams) => {
            const data: Options<ReviewServiceTemplateRequestData> = {
                body: requestParams.reviewServiceTemplateRequest,
                path: {
                    requestId: requestParams.id,
                },
            };
            const response = await reviewServiceTemplateRequest(data);
            return response.data;
        },
    });
}

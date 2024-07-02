/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    ReviewRegistrationData,
    ReviewRegistrationRequest,
    reviewRegistration,
} from '../../../../xpanse-api/generated';

const reviewKey: string = 'review';

export interface ApproveOrRejectRequestParams {
    id: string;
    reviewRegistrationRequest: ReviewRegistrationRequest;
}

export default function useApproveOrRejectRequest(id: string) {
    return useMutation({
        mutationKey: [id, reviewKey],
        mutationFn: (requestParams: ApproveOrRejectRequestParams) => {
            const data: ReviewRegistrationData = {
                id: requestParams.id,
                requestBody: requestParams.reviewRegistrationRequest,
            };
            return reviewRegistration(data);
        },
    });
}

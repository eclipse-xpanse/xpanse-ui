/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { CloudServiceProviderService, ReviewRegistrationRequest } from '../../../../xpanse-api/generated';

export interface ApproveOrRejectRequestParams {
    id: string;
    reviewRegistrationRequest: ReviewRegistrationRequest;
}

export default function useApproveOrRejectRequest() {
    return useMutation({
        mutationFn: (requestParams: ApproveOrRejectRequestParams) => {
            return CloudServiceProviderService.reviewRegistration(
                requestParams.id,
                requestParams.reviewRegistrationRequest
            );
        },
    });
}

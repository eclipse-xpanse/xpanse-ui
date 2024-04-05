/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useMutationState } from '@tanstack/react-query';
import { CloudServiceProviderService, ReviewRegistrationRequest } from '../../../../xpanse-api/generated';

const reviewKey: string = 'review';

export interface ApproveOrRejectRequestParams {
    id: string;
    reviewRegistrationRequest: ReviewRegistrationRequest;
}

export default function useApproveOrRejectRequest(id: string) {
    return useMutation({
        mutationKey: [id, reviewKey],
        mutationFn: (requestParams: ApproveOrRejectRequestParams) => {
            return CloudServiceProviderService.reviewRegistration(
                requestParams.id,
                requestParams.reviewRegistrationRequest
            );
        },
    });
}

export function useApproveOrRejectMutationState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, reviewKey], exact: true },
        select: (mutation) => mutation.state,
    });
}

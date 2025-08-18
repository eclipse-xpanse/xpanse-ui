/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    Options,
    updateUserPolicy,
    UpdateUserPolicyData,
    UserPolicyUpdateRequest,
} from '../../../../xpanse-api/generated';

export function useUpdateUserPolicyRequest() {
    return useMutation({
        mutationFn: async ({
            userPolicyId,
            requestBody,
        }: {
            userPolicyId: string;
            requestBody: UserPolicyUpdateRequest;
        }) => {
            const request: Options<UpdateUserPolicyData> = {
                body: requestBody,
                path: {
                    userPolicyId: userPolicyId,
                },
            };
            const response = await updateUserPolicy(request);
            return response.data;
        },
    });
}

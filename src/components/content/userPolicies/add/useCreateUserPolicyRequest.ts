/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    addUserPolicy,
    type AddUserPolicyData,
    Options,
    UserPolicyCreateRequest,
} from '../../../../xpanse-api/generated';

export function useCreateUserPolicyRequest() {
    return useMutation({
        mutationFn: async (requestBody: UserPolicyCreateRequest) => {
            const request: Options<AddUserPolicyData> = {
                body: requestBody,
            };
            const response = await addUserPolicy(request);
            return response.data;
        },
    });
}

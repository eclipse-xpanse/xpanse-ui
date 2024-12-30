/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { addUserPolicy, AddUserPolicyData, UserPolicyCreateRequest } from '../../../../xpanse-api/generated';

export function useCreateUserPolicyRequest() {
    return useMutation({
        mutationFn: (requestBody: UserPolicyCreateRequest) => {
            const data: AddUserPolicyData = {
                requestBody: requestBody,
            };
            return addUserPolicy(data);
        },
    });
}

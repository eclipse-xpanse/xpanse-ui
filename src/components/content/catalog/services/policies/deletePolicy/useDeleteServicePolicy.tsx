/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteServicePolicy, DeleteServicePolicyData } from '../../../../../../xpanse-api/generated';

export const useDeleteServicePolicy = () => {
    return useMutation({
        mutationFn: (policyId: string) => {
            const deleteData: DeleteServicePolicyData = {
                policyId: policyId,
            };
            return deleteServicePolicy(deleteData);
        },
    });
};

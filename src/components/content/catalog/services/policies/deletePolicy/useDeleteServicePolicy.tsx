/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { ServicePoliciesManagementService } from '../../../../../../xpanse-api/generated';

export const useDeleteServicePolicy = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return ServicePoliciesManagementService.deleteServicePolicy(id);
        },
    });
};

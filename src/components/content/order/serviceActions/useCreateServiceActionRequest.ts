/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { createServiceAction, CreateServiceActionData } from '../../../../xpanse-api/generated';
import { Options } from '../../../../xpanse-api/generated/client';

const createServiceActionKey: string = 'createServiceAction';

export function useCreateServiceActionRequest() {
    return useMutation({
        mutationKey: [createServiceActionKey],
        mutationFn: async (data: Options<CreateServiceActionData>) => {
            const response = await createServiceAction(data);
            return response.data;
        },
        gcTime: 0,
    });
}

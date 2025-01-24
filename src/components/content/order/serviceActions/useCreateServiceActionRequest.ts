/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { createServiceAction, CreateServiceActionData } from '../../../../xpanse-api/generated';

const createServiceActionKey: string = 'createServiceAction';

export function useCreateServiceActionRequest() {
    return useMutation({
        mutationKey: [createServiceActionKey],
        mutationFn: (data: CreateServiceActionData) => {
            return createServiceAction(data);
        },
        gcTime: 0,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { destroy, DestroyData } from '../../../../xpanse-api/generated';

export function useDestroyRequestSubmitQuery() {
    return useMutation({
        mutationFn: (id: string) => {
            const data: DestroyData = {
                id: id,
            };
            return destroy(data);
        },
    });
}

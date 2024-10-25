/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { startService, type StartServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateStartQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (serviceId: string) => {
            const data: StartServiceData = {
                serviceId: serviceId,
            };
            return startService(data);
        },
        onSuccess: refreshData,
    });
}

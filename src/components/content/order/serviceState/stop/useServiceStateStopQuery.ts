/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { stopService, type StopServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateStopQuery() {
    return useMutation({
        mutationFn: (serviceId: string) => {
            const data: StopServiceData = {
                serviceId: serviceId,
            };
            return stopService(data);
        },
    });
}

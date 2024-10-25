/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { restartService, type RestartServiceData } from '../../../../../xpanse-api/generated';

export function useServiceStateRestartQuery(refreshData: () => void) {
    return useMutation({
        mutationFn: (serviceId: string) => {
            const data: RestartServiceData = {
                serviceId: serviceId,
            };
            return restartService(data);
        },
        onSuccess: refreshData,
    });
}

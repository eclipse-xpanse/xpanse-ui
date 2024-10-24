/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getCurrentConfigurationOfService,
    GetCurrentConfigurationOfServiceData,
} from '../../../../xpanse-api/generated';

export default function GetCurrentServiceConfiguration(serviceId: string) {
    return useQuery({
        queryKey: ['currentServiceConfiguration', serviceId],
        queryFn: () => {
            const data: GetCurrentConfigurationOfServiceData = {
                serviceId: serviceId,
            };
            return getCurrentConfigurationOfService(data);
        },
        refetchOnWindowFocus: false,
    });
}

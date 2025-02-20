/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { changeServiceConfiguration, type ChangeServiceConfigurationData } from '../../../../xpanse-api/generated';

const updateCurrentServiceConfigurationKey: string = 'updateCurrentServiceConfig';

export function useUpdateServiceConfigurationRequest() {
    return useMutation({
        mutationKey: [updateCurrentServiceConfigurationKey],
        mutationFn: (data: ChangeServiceConfigurationData) => {
            return changeServiceConfiguration(data);
        },
        gcTime: 0,
    });
}

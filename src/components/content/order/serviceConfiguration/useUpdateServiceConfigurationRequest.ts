/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import {
    changeServiceConfiguration,
    type ChangeServiceConfigurationData,
    Options,
} from '../../../../xpanse-api/generated';

const updateCurrentServiceConfigurationKey: string = 'updateCurrentServiceConfig';

export function useUpdateServiceConfigurationRequest() {
    return useMutation({
        mutationKey: [updateCurrentServiceConfigurationKey],
        mutationFn: async (data: Options<ChangeServiceConfigurationData>) => {
            const response = await changeServiceConfiguration(data);
            return response.data;
        },
        gcTime: 0,
    });
}

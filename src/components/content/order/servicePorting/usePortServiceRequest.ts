/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { Options, port, type PortData, ServicePortingRequest } from '../../../../xpanse-api/generated';

export function usePortServiceRequest() {
    return useMutation({
        mutationFn: async (servicePortingRequest: ServicePortingRequest) => {
            const request: Options<PortData> = {
                body: servicePortingRequest,
            };
            const response = await port(request);
            return response.data;
        },
    });
}

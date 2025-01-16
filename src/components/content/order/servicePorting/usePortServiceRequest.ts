/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { port, type PortData, ServicePortingRequest } from '../../../../xpanse-api/generated';

export function usePortServiceRequest() {
    return useMutation({
        mutationFn: (servicePortingRequest: ServicePortingRequest) => {
            const data: PortData = {
                requestBody: servicePortingRequest,
            };
            return port(data);
        },
    });
}

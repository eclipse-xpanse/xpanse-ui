/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { recreateService, type RecreateServiceData } from '../../../../xpanse-api/generated/';

export default function useRecreateRequest() {
    return useMutation({
        mutationFn: (serviceId: string) => {
            const data: RecreateServiceData = { serviceId: serviceId };
            return recreateService(data);
        },
    });
}

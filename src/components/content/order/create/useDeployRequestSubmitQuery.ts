/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { DeployRequest, ServiceService } from '../../../../xpanse-api/generated';

export function useDeployRequestSubmitQuery() {
    return useMutation({
        mutationFn: (createRequest: DeployRequest) => {
            return ServiceService.deploy(createRequest);
        },
    });
}

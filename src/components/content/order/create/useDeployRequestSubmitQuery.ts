/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { deploy, DeployRequest, Options, type DeployData } from '../../../../xpanse-api/generated';

export function useDeployRequestSubmitQuery() {
    return useMutation({
        mutationFn: async (createRequest: DeployRequest) => {
            const request: Options<DeployData> = {
                body: createRequest,
            };
            const response = await deploy(request);
            return response.data;
        },
    });
}

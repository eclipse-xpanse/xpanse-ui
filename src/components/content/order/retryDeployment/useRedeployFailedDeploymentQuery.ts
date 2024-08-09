/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { redeployFailedDeployment, RedeployFailedDeploymentData } from '../../../../xpanse-api/generated/';

export default function useRedeployFailedDeploymentQuery() {
    return useMutation({
        mutationFn: (serviceId: string) => {
            const data: RedeployFailedDeploymentData = { serviceId: serviceId };
            return redeployFailedDeployment(data);
        },
    });
}

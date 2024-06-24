/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation } from '@tanstack/react-query';
import { ServiceService } from '../../../../xpanse-api/generated';

export default function useRedeployFailedDeploymentQuery() {
    return useMutation({
        mutationFn: (uuid: string) => {
            return ServiceService.redeployFailedDeployment(uuid);
        },
    });
}

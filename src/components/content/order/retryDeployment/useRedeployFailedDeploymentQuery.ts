/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Options,
    redeployFailedDeployment,
    RedeployFailedDeploymentData,
    ServiceHostingType,
} from '../../../../xpanse-api/generated/';
import { getQueryKeyForServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';

export default function useRedeployFailedDeploymentQuery(serviceHostingType: ServiceHostingType) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (serviceId: string) => {
            const request: Options<RedeployFailedDeploymentData> = {
                path: {
                    serviceId: serviceId,
                },
            };
            const response = await redeployFailedDeployment(request);
            return response.data;
        },
        onSuccess: (data) => {
            if (data) {
                queryClient.removeQueries({
                    queryKey: getQueryKeyForServiceDetailsByServiceIdQuery(data.serviceId, serviceHostingType),
                });
            }
        },
    });
}

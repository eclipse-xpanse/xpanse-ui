/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useQuery } from '@tanstack/react-query';
import {
    getLatestServiceOrderStatus,
    GetLatestServiceOrderStatusData,
    getSelfHostedServiceDetailsById,
    GetSelfHostedServiceDetailsByIdData,
    getVendorHostedServiceDetailsById,
    GetVendorHostedServiceDetailsByIdData,
    serviceDeploymentState,
    serviceHostingType,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsPollingQuery(
    serviceId: string | undefined,
    isStartPolling: boolean,
    currentHostingType: serviceHostingType,
    refetchUntilStates: serviceDeploymentState[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, currentHostingType],
        queryFn: () => {
            if (currentHostingType === serviceHostingType.SELF) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return getVendorHostedServiceDetailsById(data);
            }
        },
        refetchInterval: (query) =>
            query.state.data &&
            refetchUntilStates.includes(query.state.data.serviceDeploymentState as serviceDeploymentState)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: serviceId !== undefined && isStartPolling,
        gcTime: 0,
    });
}

export function useServiceDetailsByIdQuery(
    serviceId: string | undefined,
    isStart: boolean,
    currentHostingType: serviceHostingType
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, currentHostingType],
        queryFn: () => {
            if (currentHostingType === serviceHostingType.SELF) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    serviceId: serviceId ?? '',
                };
                return getVendorHostedServiceDetailsById(data);
            }
        },
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: serviceId !== undefined && isStart,
        gcTime: 0,
    });
}

export function useLatestServiceOrderStatusQuery(
    orderId: string | undefined,
    isStartPolling: boolean,
    refetchUntilStates: taskStatus[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', orderId],
        queryFn: () => {
            const data: GetLatestServiceOrderStatusData = {
                lastKnownServiceDeploymentState: undefined,
                orderId: orderId ?? '',
            };
            return getLatestServiceOrderStatus(data);
        },
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.taskStatus as taskStatus)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: orderId !== undefined && isStartPolling,
        gcTime: 0,
    });
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    GetMigrationOrderDetailsByIdData,
    GetSelfHostedServiceDetailsByIdData,
    GetVendorHostedServiceDetailsByIdData,
    MigrateData,
    MigrateRequest,
    getMigrationOrderDetailsById,
    getSelfHostedServiceDetailsById,
    getVendorHostedServiceDetailsById,
    migrate,
    migrationStatus,
    serviceHostingType,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useMigrateServiceQuery() {
    return useMutation({
        mutationFn: (migrateRequest: MigrateRequest) => {
            const data: MigrateData = {
                requestBody: migrateRequest,
            };
            return migrate(data);
        },
    });
}

export function useMigrateServiceDetailsPollingQuery(
    migrationId: string | undefined,
    isStartPolling: boolean,
    refetchUntilStates: migrationStatus[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', migrationId],
        queryFn: () => {
            const data: GetMigrationOrderDetailsByIdData = {
                migrationId: migrationId ?? '',
            };
            return getMigrationOrderDetailsById(data);
        },
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.migrationStatus as migrationStatus)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: migrationId !== undefined && isStartPolling,
    });
}

export function useServiceDetailsPollingQuery(
    serviceId: string | undefined,
    currentServiceHostingType: string,
    currentMigrationStatus: string | undefined
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, currentServiceHostingType],
        queryFn: () => {
            if (currentServiceHostingType === serviceHostingType.SELF.toString()) {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    id: serviceId ?? '',
                };
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    id: serviceId ?? '',
                };
                return getVendorHostedServiceDetailsById(data);
            }
        },
        enabled:
            serviceId !== undefined &&
            (currentMigrationStatus === migrationStatus.MIGRATION_COMPLETED ||
                currentMigrationStatus === migrationStatus.DEPLOY_FAILED ||
                currentMigrationStatus === migrationStatus.DESTROY_FAILED),
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

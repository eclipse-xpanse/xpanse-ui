/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    DeployedService,
    GetMigrationOrderDetailsByIdData,
    GetSelfHostedServiceDetailsByIdData,
    GetVendorHostedServiceDetailsByIdData,
    MigrateData,
    MigrateRequest,
    ServiceMigrationDetails,
    getMigrationOrderDetailsById,
    getSelfHostedServiceDetailsById,
    getVendorHostedServiceDetailsById,
    migrate,
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
    refetchUntilStates: ServiceMigrationDetails['migrationStatus'][]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', migrationId],
        queryFn: () => {
            const data: GetMigrationOrderDetailsByIdData = {
                migrationId: migrationId ?? '',
            };
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return getMigrationOrderDetailsById(data);
        },
        refetchInterval: (query) =>
            query.state.data && refetchUntilStates.includes(query.state.data.migrationStatus)
                ? false
                : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        enabled: migrationId !== undefined && isStartPolling,
    });
}

export function useServiceDetailsPollingQuery(
    serviceId: string | undefined,
    serviceHostingType: DeployedService['serviceHostingType'],
    migrationStatus: ServiceMigrationDetails['migrationStatus'] | undefined
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType.toString() === 'self') {
                const data: GetSelfHostedServiceDetailsByIdData = {
                    id: serviceId ?? '',
                };
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return getSelfHostedServiceDetailsById(data);
            } else {
                const data: GetVendorHostedServiceDetailsByIdData = {
                    id: serviceId ?? '',
                };
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return getVendorHostedServiceDetailsById(data);
            }
        },
        enabled:
            serviceId !== undefined &&
            (migrationStatus?.toString() === 'MigrationCompleted' ||
                migrationStatus?.toString() === 'DeployFailed' ||
                migrationStatus?.toString() === 'DestroyFailed'),
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

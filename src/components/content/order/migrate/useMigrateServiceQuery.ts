/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import {
    DeployedService,
    MigrateRequest,
    MigrationService,
    ServiceMigrationDetails,
    ServiceService,
} from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useMigrateServiceQuery() {
    return useMutation({
        mutationFn: (migrateRequest: MigrateRequest) => {
            return MigrationService.migrate(migrateRequest);
        },
    });
}

export function useMigrateServiceDetailsPollingQuery(
    migrationId: string | undefined,
    isStartPolling: boolean,
    refetchUntilStates: ServiceMigrationDetails.migrationStatus[]
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', migrationId],
        queryFn: () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return MigrationService.getMigrationOrderDetailsById(migrationId!);
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
    serviceHostingType: DeployedService.serviceHostingType,
    migrationStatus: ServiceMigrationDetails.migrationStatus | undefined
) {
    return useQuery({
        queryKey: ['getServiceDetailsById', serviceId, serviceHostingType],
        queryFn: () => {
            if (serviceHostingType === DeployedService.serviceHostingType.SELF) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return ServiceService.getSelfHostedServiceDetailsById(serviceId!);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return ServiceService.getVendorHostedServiceDetailsById(serviceId!);
            }
        },
        enabled:
            serviceId !== undefined &&
            (migrationStatus === ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED ||
                migrationStatus === ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED ||
                migrationStatus === ServiceMigrationDetails.migrationStatus.DESTROY_FAILED),
    });
}

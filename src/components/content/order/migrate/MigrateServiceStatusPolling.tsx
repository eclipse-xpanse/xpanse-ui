/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import {
    DeployedServiceDetails,
    ServiceMigrationDetails,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { useStopwatch } from 'react-timer-hook';
import React, { useEffect, useState } from 'react';
import { MigrationStatus } from '../types/MigrationStatus';
import { useMigrateServiceDetailsPollingQuery, useServiceDetailsPollingQuery } from './useMigrateServiceQuery';
import { OperationType } from '../types/OperationType';
import { MigrationOrderSubmitResult } from './MigrationOrderSubmitResult';
import { MigrationProcessingStatus } from './MigrationProcessingStatus';

function MigrateServiceStatusPolling({
    migrationId,
    isMigrateRequestSuccess,
    migrateRequestError,
    isMigrateRequestLoading,
    setIsMigrating,
    setMigrateDisable,
    setIsPreviousDisabled,
    getCurrentMigrationStepStatus,
    serviceHostingType,
    currentContactServiceDetails,
}: {
    migrationId: string | undefined;
    isMigrateRequestSuccess: boolean;
    migrateRequestError: Error | null;
    isMigrateRequestLoading: boolean;
    setIsMigrating: (arg: boolean) => void;
    setMigrateDisable: (arg: boolean) => void;
    setIsPreviousDisabled: (arg: boolean) => void;
    getCurrentMigrationStepStatus: (srg: MigrationStatus) => void;
    serviceHostingType: DeployedServiceDetails.serviceHostingType;
    currentContactServiceDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const [newServiceId, setNewServiceId] = useState<string | undefined>(undefined);
    const [oldServiceId, setOldServiceId] = useState<string | undefined>(undefined);
    const [migrationStatus, setMigrationStatus] = useState<ServiceMigrationDetails.migrationStatus>(
        ServiceMigrationDetails.migrationStatus.MIGRATION_STARTED
    );

    const migrateServiceDetailsQuery = useMigrateServiceDetailsPollingQuery(migrationId, isMigrateRequestSuccess, [
        ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED,
        ServiceMigrationDetails.migrationStatus.MIGRATION_FAILED,
        ServiceMigrationDetails.migrationStatus.DESTROY_FAILED,
        ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED,
        ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED,
        ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED,
    ]);
    const deployServiceDetailsQuery = useServiceDetailsPollingQuery(newServiceId, serviceHostingType, migrationStatus);
    const destroyServiceDetailsQuery = useServiceDetailsPollingQuery(oldServiceId, serviceHostingType, migrationStatus);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (migrateServiceDetailsQuery.isSuccess) {
            if (
                migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED.toString()
            ) {
                setIsMigrating(false);
                setMigrateDisable(true);
                setIsPreviousDisabled(true);
                getCurrentMigrationStepStatus(MigrationStatus.Finished);
            } else if (
                migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                    ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED.toString() ||
                migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                    ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED.toString() ||
                migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                    ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED.toString() ||
                migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                    ServiceMigrationDetails.migrationStatus.DESTROY_FAILED.toString() ||
                migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                    ServiceMigrationDetails.migrationStatus.MIGRATION_FAILED.toString()
            ) {
                setIsMigrating(false);
                setMigrateDisable(true);
                setIsPreviousDisabled(false);
                getCurrentMigrationStepStatus(MigrationStatus.Failed);
            } else {
                setIsMigrating(true);
                setMigrateDisable(true);
                setIsPreviousDisabled(true);
                getCurrentMigrationStepStatus(MigrationStatus.Processing);
            }
            setNewServiceId(migrateServiceDetailsQuery.data.newServiceId);
            setOldServiceId(migrateServiceDetailsQuery.data.oldServiceId);
            setMigrationStatus(migrateServiceDetailsQuery.data.migrationStatus);
        }
    }, [
        migrateServiceDetailsQuery.isSuccess,
        migrateServiceDetailsQuery.data,
        setIsMigrating,
        setMigrateDisable,
        setIsPreviousDisabled,
        getCurrentMigrationStepStatus,
        oldServiceId,
        newServiceId,
    ]);

    useEffect(() => {
        if (migrateServiceDetailsQuery.isPending || isMigrateRequestLoading) {
            setIsMigrating(true);
            setMigrateDisable(true);
            setIsPreviousDisabled(true);
            getCurrentMigrationStepStatus(MigrationStatus.Processing);
        }
        if (migrateServiceDetailsQuery.error) {
            setIsMigrating(false);
            setMigrateDisable(true);
            setIsPreviousDisabled(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
        }
        if (migrateRequestError) {
            setIsMigrating(false);
            setMigrateDisable(true);
            setIsPreviousDisabled(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
        }
    }, [
        migrateServiceDetailsQuery.isPending,
        migrateServiceDetailsQuery.error,
        migrateRequestError,
        isMigrateRequestLoading,
        setIsMigrating,
        setMigrateDisable,
        setIsPreviousDisabled,
        getCurrentMigrationStepStatus,
    ]);

    if (isMigrateRequestLoading) {
        return MigrationOrderSubmitResult(
            'Request submission in-progress',
            '-',
            'success',
            DeployedServiceDetails.serviceDeploymentState.MIGRATING,
            stopWatch,
            OperationType.Migrate,
            undefined
        );
    }

    if (migrateRequestError) {
        return MigrationOrderSubmitResult(
            migrateRequestError.message,
            '-',
            'error',
            DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate,
            currentContactServiceDetails
        );
    }

    if (migrateServiceDetailsQuery.isPending) {
        return MigrationOrderSubmitResult(
            'Migrating..., Please wait...',
            '-',
            'success',
            DeployedServiceDetails.serviceDeploymentState.MIGRATING,
            stopWatch,
            OperationType.Migrate,
            undefined
        );
    }

    if (migrateServiceDetailsQuery.error) {
        return MigrationOrderSubmitResult(
            migrateServiceDetailsQuery.error.message,
            '-',
            'error',
            DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate,
            currentContactServiceDetails
        );
    }

    if (
        migrateServiceDetailsQuery.data.migrationStatus.toString() ===
        ServiceMigrationDetails.migrationStatus.MIGRATION_COMPLETED.toString()
    ) {
        if (deployServiceDetailsQuery.isSuccess) {
            return MigrationOrderSubmitResult(
                MigrationProcessingStatus(deployServiceDetailsQuery.data, serviceHostingType),
                migrateServiceDetailsQuery.data.newServiceId,
                'success',
                DeployedServiceDetails.serviceDeploymentState.MIGRATION_SUCCESSFUL,
                stopWatch,
                OperationType.Migrate,
                undefined
            );
        }
    } else {
        if (
            migrateServiceDetailsQuery.data.migrationStatus.toString() ===
            ServiceMigrationDetails.migrationStatus.DEPLOY_FAILED.toString()
        ) {
            if (deployServiceDetailsQuery.isSuccess) {
                return MigrationOrderSubmitResult(
                    MigrationProcessingStatus(deployServiceDetailsQuery.data, serviceHostingType),
                    migrateServiceDetailsQuery.data.newServiceId,
                    'error',
                    DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
                    stopWatch,
                    OperationType.Migrate,
                    undefined
                );
            }
        } else if (
            migrateServiceDetailsQuery.data.migrationStatus.toString() ===
            ServiceMigrationDetails.migrationStatus.DESTROY_FAILED.toString()
        ) {
            if (destroyServiceDetailsQuery.isSuccess) {
                return MigrationOrderSubmitResult(
                    MigrationProcessingStatus(destroyServiceDetailsQuery.data, serviceHostingType),
                    migrateServiceDetailsQuery.data.newServiceId,
                    'error',
                    DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
                    stopWatch,
                    OperationType.Migrate,
                    undefined
                );
            }
        } else if (
            migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                ServiceMigrationDetails.migrationStatus.DATA_EXPORT_FAILED.toString() ||
            migrateServiceDetailsQuery.data.migrationStatus.toString() ===
                ServiceMigrationDetails.migrationStatus.DATA_IMPORT_FAILED.toString()
        ) {
            return MigrationOrderSubmitResult(
                'Migration failed',
                migrateServiceDetailsQuery.data.newServiceId,
                'error',
                DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
                stopWatch,
                OperationType.Migrate,
                undefined
            );
        } else {
            return MigrationOrderSubmitResult(
                'Migrating..., Please wait...',
                migrateServiceDetailsQuery.data.newServiceId,
                'success',
                DeployedServiceDetails.serviceDeploymentState.MIGRATING,
                stopWatch,
                OperationType.Migrate,
                undefined
            );
        }
    }
    return <></>;
}

export default MigrateServiceStatusPolling;

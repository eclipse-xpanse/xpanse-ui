/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployedServiceDetails } from '../../../../xpanse-api/generated';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { OrderSubmitFailed } from '../orderStatus/OrderSubmitFailed';
import { useStopwatch } from 'react-timer-hook';
import React, { useEffect, useState } from 'react';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { MigrationStatus } from '../types/MigrationStatus';
import { OperationType } from '../types/OperationType';

function MigrateServiceStatusPolling({
    destroyUuid,
    deployUuid,
    isMigrateSuccess,
    error,
    isLoading,
    setIsMigrating,
    setRequestSubmitted,
    setIsPreviousDisabled,
    getCurrentMigrationStepStatus,
    serviceHostingType,
}: {
    destroyUuid: string | undefined;
    deployUuid: string | undefined;
    isMigrateSuccess: boolean;
    error: Error | null;
    isLoading: boolean;
    setIsMigrating: (arg: boolean) => void;
    setRequestSubmitted: (arg: boolean) => void;
    setIsPreviousDisabled: (arg: boolean) => void;
    getCurrentMigrationStepStatus: (srg: MigrationStatus) => void;
    serviceHostingType: DeployedServiceDetails.serviceHostingType;
}): React.JSX.Element {
    const [isStart, setIsStart] = useState<boolean>(false);

    const getDestroyServiceEntityByIdQuery = useServiceDetailsPollingQuery(destroyUuid, isStart, serviceHostingType, [
        DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL,
        DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED,
    ]);

    const getDeployServiceEntityByIdQuery = useServiceDetailsPollingQuery(deployUuid, isStart, serviceHostingType, [
        DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
        DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (!isMigrateSuccess || getDeployServiceEntityByIdQuery.isError || getDestroyServiceEntityByIdQuery.isError) {
            setIsStart(false);
            setIsMigrating(false);
            setRequestSubmitted(false);
            setIsPreviousDisabled(false);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
        } else {
            setIsStart(true);
            setIsMigrating(false);
            setRequestSubmitted(true);
            setIsPreviousDisabled(true);
            getCurrentMigrationStepStatus(MigrationStatus.Processing);
        }
    }, [
        isStart,
        isMigrateSuccess,
        setIsMigrating,
        setRequestSubmitted,
        setIsPreviousDisabled,
        getCurrentMigrationStepStatus,
        getDeployServiceEntityByIdQuery.isError,
        getDestroyServiceEntityByIdQuery.isError,
    ]);

    useEffect(() => {
        if (
            getDestroyServiceEntityByIdQuery.data &&
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL.toString()
        ) {
            setIsMigrating(false);
            setRequestSubmitted(true);
            setIsPreviousDisabled(true);
            getCurrentMigrationStepStatus(MigrationStatus.Finished);
        }
        if (
            getDestroyServiceEntityByIdQuery.data &&
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString()
        ) {
            setIsMigrating(false);
            setRequestSubmitted(false);
            setIsPreviousDisabled(true);
            getCurrentMigrationStepStatus(MigrationStatus.Failed);
        }
    }, [
        getDestroyServiceEntityByIdQuery.data,
        setIsMigrating,
        setRequestSubmitted,
        setIsPreviousDisabled,
        getCurrentMigrationStepStatus,
    ]);

    useEffect(() => {
        if (error) {
            setIsStart(false);
            setIsMigrating(false);
            setRequestSubmitted(false);
        }
    }, [error, setIsMigrating, setRequestSubmitted]);

    if (isLoading) {
        return OrderSubmitResult(
            'Request submission in-progress',
            '-',
            'success',
            DeployedServiceDetails.serviceDeploymentState.MIGRATING,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (error) {
        return OrderSubmitFailed(
            error,
            DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (destroyUuid && !isMigrateSuccess) {
        return OrderSubmitResult(
            'Migration status polling failed. Please visit MyServices page to check the status of the request.',
            destroyUuid,
            'error',
            DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (deployUuid && getDeployServiceEntityByIdQuery.isError) {
        return OrderSubmitFailed(
            getDeployServiceEntityByIdQuery.error,
            DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (destroyUuid && getDestroyServiceEntityByIdQuery.isError) {
        return OrderSubmitFailed(
            getDestroyServiceEntityByIdQuery.error,
            DeployedServiceDetails.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (
        deployUuid &&
        getDeployServiceEntityByIdQuery.data &&
        getDeployServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString()
    ) {
        return OrderSubmitResult(
            ProcessingStatus(getDeployServiceEntityByIdQuery.data, OperationType.Migrate),
            deployUuid,
            'error',
            getDeployServiceEntityByIdQuery.data.serviceDeploymentState,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (
        deployUuid &&
        getDeployServiceEntityByIdQuery.data &&
        getDeployServiceEntityByIdQuery.data.serviceDeploymentState.toString() !==
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString()
    ) {
        if (
            destroyUuid &&
            getDestroyServiceEntityByIdQuery.data &&
            (getDestroyServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DESTROYING.toString() ||
                getDestroyServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
                    DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString())
        ) {
            return OrderSubmitResult(
                'Migrating..., Please wait...',
                deployUuid,
                'success',
                getDeployServiceEntityByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Migrate
            );
        }

        if (
            destroyUuid &&
            getDestroyServiceEntityByIdQuery.data &&
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED.toString()
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDestroyServiceEntityByIdQuery.data, OperationType.Migrate),
                destroyUuid,
                'error',
                getDestroyServiceEntityByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Migrate
            );
        }

        if (
            destroyUuid &&
            getDestroyServiceEntityByIdQuery.data &&
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL.toString()
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDeployServiceEntityByIdQuery.data, OperationType.Migrate),
                deployUuid,
                'success',
                getDestroyServiceEntityByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Migrate
            );
        }
    }
    return <></>;
}

export default MigrateServiceStatusPolling;

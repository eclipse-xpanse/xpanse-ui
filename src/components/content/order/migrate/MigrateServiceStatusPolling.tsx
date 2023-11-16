/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceDetailVo } from '../../../../xpanse-api/generated';
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
}): React.JSX.Element {
    const [isStart, setIsStart] = useState<boolean>(false);

    const getDestroyServiceEntityByIdQuery = useServiceDetailsPollingQuery(destroyUuid, isStart, [
        ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
        ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
    ]);

    const getDeployServiceEntityByIdQuery = useServiceDetailsPollingQuery(deployUuid, isStart, [
        ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
        ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
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
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
        ) {
            setIsMigrating(false);
            setRequestSubmitted(true);
            setIsPreviousDisabled(true);
            getCurrentMigrationStepStatus(MigrationStatus.Finished);
        }
        if (
            getDestroyServiceEntityByIdQuery.data &&
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
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
            ServiceDetailVo.serviceDeploymentState.MIGRATING,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (error) {
        return OrderSubmitFailed(
            error,
            ServiceDetailVo.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (destroyUuid && !isMigrateSuccess) {
        return OrderSubmitResult(
            'Migration status polling failed. Please visit MyServices page to check the status of the request.',
            destroyUuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (deployUuid && getDeployServiceEntityByIdQuery.isError) {
        return OrderSubmitFailed(
            getDeployServiceEntityByIdQuery.error,
            ServiceDetailVo.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (destroyUuid && getDestroyServiceEntityByIdQuery.isError) {
        return OrderSubmitFailed(
            getDestroyServiceEntityByIdQuery.error,
            ServiceDetailVo.serviceDeploymentState.MIGRATION_FAILED,
            stopWatch,
            OperationType.Migrate
        );
    }

    if (
        deployUuid &&
        getDeployServiceEntityByIdQuery.data &&
        getDeployServiceEntityByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
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
        getDeployServiceEntityByIdQuery.data.serviceDeploymentState !==
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
    ) {
        if (
            destroyUuid &&
            getDestroyServiceEntityByIdQuery.data &&
            (getDestroyServiceEntityByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DESTROYING ||
                getDestroyServiceEntityByIdQuery.data.serviceDeploymentState ===
                    ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL)
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
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
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
            getDestroyServiceEntityByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
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

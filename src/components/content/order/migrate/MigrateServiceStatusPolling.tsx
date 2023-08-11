/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useStopwatch } from 'react-timer-hook';
import React, { useEffect } from 'react';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { ServiceDetailVo } from '../../../../xpanse-api/generated';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { OperationType } from '../formElements/CommonTypes';

function MigrateServiceStatusPolling({
    deployUuid,
    deployError,
    destroyUuid,
    destroyError,
    isDeployLoading,
    isDesployLoading,
    setMigrating,
    setMigrateDisable,
}: {
    deployUuid: string | undefined;
    deployError: Error | undefined;
    destroyUuid: string;
    destroyError: Error | undefined;
    isDeployLoading: boolean;
    isDesployLoading: boolean;
    setMigrating: (arg: boolean) => void;
    setMigrateDisable: (arg: boolean) => void;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(deployUuid, [
        ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
        ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS,
    ]);

    const getDestroyedServiceDetailsByIdQuery = useServiceDetailsPollingQuery(destroyUuid, [
        ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
        ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS
        ) {
            setMigrating(false);
            setMigrateDisable(true);
        }
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED
        ) {
            setMigrating(false);
            setMigrateDisable(false);
        }
        if (
            getDestroyedServiceDetailsByIdQuery.data &&
            [
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
            ].includes(getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            setMigrating(false);
            setMigrateDisable(true);
        }
    }, [getDestroyedServiceDetailsByIdQuery.data, getServiceDetailsByIdQuery.data, setMigrateDisable, setMigrating]);

    useEffect(() => {
        if (deployError || destroyError) {
            setMigrating(false);
            setMigrateDisable(true);
        }
    }, [deployError, destroyError, setMigrateDisable, setMigrating]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.error || getDestroyedServiceDetailsByIdQuery.error) {
            setMigrating(false);
            setMigrateDisable(true);
        }
    }, [getServiceDetailsByIdQuery.error, getDestroyedServiceDetailsByIdQuery.error, setMigrateDisable, setMigrating]);

    if (isDeployLoading) {
        return OrderSubmitResult(
            'Request submission in-progress',
            destroyUuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (isDesployLoading) {
        return OrderSubmitResult(
            'Request submission in-progress',
            destroyUuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DESTROYING,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (deployError && getServiceDetailsByIdQuery.data !== undefined && deployUuid !== undefined) {
        return OrderSubmitResult(
            ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Migrate),
            deployUuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (destroyError && getDestroyedServiceDetailsByIdQuery.data !== undefined) {
        return OrderSubmitResult(
            ProcessingStatus(getDestroyedServiceDetailsByIdQuery.data, OperationType.Migrate),
            destroyUuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (deployUuid && getServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Migrating status polling failed. Please visit MyServices page to check the status of the request.',
            deployUuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (destroyUuid && getDestroyedServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Migrating status polling failed. Please visit MyServices page to check the status of the request.',
            destroyUuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (deployUuid && getServiceDetailsByIdQuery.data) {
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED
        ) {
            return OrderSubmitResult(
                'Migrating status polling failed. Please visit MyServices page to check the status of the request.',
                deployUuid,
                'error',
                ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
                stopWatch,
                OperationType.Deploy
            );
        }
    }

    if (destroyUuid && getDestroyedServiceDetailsByIdQuery.data)
        if (
            getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROYING
        ) {
            return OrderSubmitResult(
                'Migrating, Please wait...',
                destroyUuid,
                'success',
                ServiceDetailVo.serviceDeploymentState.DESTROYING,
                stopWatch,
                OperationType.Destroy
            );
        } else if (
            getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDestroyedServiceDetailsByIdQuery.data, OperationType.Migrate),
                destroyUuid,
                'success',
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
                stopWatch,
                OperationType.Destroy
            );
        } else if (
            getDestroyedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDestroyedServiceDetailsByIdQuery.data, OperationType.Migrate),
                destroyUuid,
                'error',
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                stopWatch,
                OperationType.Destroy
            );
        }

    if (getServiceDetailsByIdQuery.isSuccess && getDestroyedServiceDetailsByIdQuery.isSuccess) {
        setMigrating(false);
        setMigrateDisable(true);
        return OrderSubmitResult(
            'Request accepted',
            destroyUuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (deployUuid !== undefined && getServiceDetailsByIdQuery.data === undefined) {
        return OrderSubmitResult(
            'Request accepted',
            deployUuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (getDestroyedServiceDetailsByIdQuery.data === undefined) {
        return OrderSubmitResult(
            'Request accepted',
            destroyUuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DESTROYING,
            stopWatch,
            OperationType.Destroy
        );
    }

    return <></>;
}

export default MigrateServiceStatusPolling;

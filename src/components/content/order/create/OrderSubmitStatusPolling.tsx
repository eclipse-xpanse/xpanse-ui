/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { DeployedServiceDetails } from '../../../../xpanse-api/generated';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { OrderSubmitFailed } from '../orderStatus/OrderSubmitFailed';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { useStopwatch } from 'react-timer-hook';
import React, { useEffect } from 'react';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { OperationType } from '../types/OperationType';

function OrderSubmitStatusPolling({
    uuid,
    error,
    isSuccess,
    isLoading,
    setIsDeploying,
    setRequestSubmitted,
    serviceHostingType,
}: {
    uuid: string | undefined;
    error: Error | null;
    isSuccess: boolean;
    isLoading: boolean;
    setIsDeploying: (arg: boolean) => void;
    setRequestSubmitted: (arg: boolean) => void;
    serviceHostingType: DeployedServiceDetails.serviceHostingType;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(uuid, isSuccess, serviceHostingType, [
        DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
        DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString()
        ) {
            setIsDeploying(false);
            setRequestSubmitted(true);
        }
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString()
        ) {
            setIsDeploying(false);
            setRequestSubmitted(false);
        }
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
                DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString()
        ) {
            setIsDeploying(false);
            setRequestSubmitted(false);
        }
    }, [getServiceDetailsByIdQuery.data, setIsDeploying, setRequestSubmitted]);

    useEffect(() => {
        if (error) {
            setIsDeploying(false);
            setRequestSubmitted(false);
        }
    }, [error, setIsDeploying, setRequestSubmitted]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.error) {
            setIsDeploying(false);
        }
    }, [getServiceDetailsByIdQuery.error, setIsDeploying]);

    if (isLoading) {
        return OrderSubmitResult(
            'Request submission in-progress',
            '-',
            'success',
            DeployedServiceDetails.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (error) {
        return OrderSubmitFailed(
            error,
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (uuid && getServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Deployment status polling failed. Please visit MyServices page to check the status of the request.',
            uuid,
            'error',
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (
        uuid &&
        getServiceDetailsByIdQuery.data?.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DEPLOYING.toString()
    ) {
        return OrderSubmitResult(
            'Deploying, Please wait...',
            uuid,
            'success',
            DeployedServiceDetails.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (uuid !== undefined && getServiceDetailsByIdQuery.data === undefined) {
        return OrderSubmitResult(
            'Request accepted',
            uuid,
            'success',
            DeployedServiceDetails.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (
        uuid &&
        getServiceDetailsByIdQuery.data &&
        getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() !==
            DeployedServiceDetails.serviceDeploymentState.DEPLOYING.toString()
    ) {
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL.toString()
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Deploy),
                uuid,
                'success',
                getServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Deploy
            );
        }
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DEPLOYMENT_FAILED.toString()
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Deploy),
                uuid,
                'error',
                getServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Deploy
            );
        }
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.ROLLBACK_FAILED.toString()
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Deploy),
                uuid,
                'error',
                getServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Deploy
            );
        }
    }

    return <></>;
}

export default OrderSubmitStatusPolling;

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useStopwatch } from 'react-timer-hook';
import React, { useEffect } from 'react';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import { ServiceDetailVo } from '../../../../xpanse-api/generated';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { OrderSubmitFailed } from '../orderStatus/OrderSubmitFailed';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { OperationType } from '../formElements/CommonTypes';

function DestroyServiceStatusPolling({
    uuid,
    error,
    isLoading,
    setIsDestroying,
    setIsDestroyingCompleted,
}: {
    uuid: string;
    error: Error | undefined;
    isLoading: boolean;
    setIsDestroying: (arg: boolean) => void;
    setIsDestroyingCompleted: (arg: boolean) => void;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(uuid, [
        ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
        ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.data &&
            [
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
            ].includes(getServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            setIsDestroying(false);
            setIsDestroyingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.data, setIsDestroyingCompleted, setIsDestroying]);

    useEffect(() => {
        if (error) {
            setIsDestroying(false);
            setIsDestroyingCompleted(true);
        }
    }, [error, setIsDestroyingCompleted, setIsDestroying]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.error) {
            setIsDestroying(false);
            setIsDestroyingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.error, setIsDestroyingCompleted, setIsDestroying]);

    if (isLoading) {
        return OrderSubmitResult(
            'Request submission in-progress',
            uuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DESTROYING,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (error) {
        return OrderSubmitFailed(
            error,
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (uuid && getServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Destroy status polling failed. Please visit MyServices page to check the status of the request.',
            uuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (uuid && getServiceDetailsByIdQuery.data)
        if (
            ![
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL,
            ].includes(getServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            return OrderSubmitResult(
                'Destroying, Please wait...',
                uuid,
                'success',
                ServiceDetailVo.serviceDeploymentState.DESTROYING,
                stopWatch,
                OperationType.Destroy
            );
        } else if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESSFUL
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Destroy),
                uuid,
                'success',
                getServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Destroy
            );
        } else if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getServiceDetailsByIdQuery.data, OperationType.Destroy),
                uuid,
                'error',
                getServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Destroy
            );
        }

    if (getServiceDetailsByIdQuery.data === undefined) {
        return OrderSubmitResult(
            'Request accepted',
            uuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DESTROYING,
            stopWatch,
            OperationType.Destroy
        );
    }

    return <></>;
}

export default DestroyServiceStatusPolling;

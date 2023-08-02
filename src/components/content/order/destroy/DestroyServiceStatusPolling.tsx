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
    const getDeployedServiceDetailsByIdQuery = useServiceDetailsPollingQuery(uuid, [
        ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
        ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (
            getDeployedServiceDetailsByIdQuery.data &&
            [
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
            ].includes(getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            setIsDestroying(false);
            setIsDestroyingCompleted(true);
        }
    }, [getDeployedServiceDetailsByIdQuery.data, setIsDestroyingCompleted, setIsDestroying]);

    useEffect(() => {
        if (error) {
            setIsDestroying(false);
            setIsDestroyingCompleted(true);
        }
    }, [error, setIsDestroyingCompleted, setIsDestroying]);

    useEffect(() => {
        if (getDeployedServiceDetailsByIdQuery.error) {
            setIsDestroying(false);
            setIsDestroyingCompleted(true);
        }
    }, [getDeployedServiceDetailsByIdQuery.error, setIsDestroyingCompleted, setIsDestroying]);

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

    if (uuid && getDeployedServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Destroy status polling failed. Please visit MyServices page to check the status of the request.',
            uuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
            stopWatch,
            OperationType.Destroy
        );
    }

    if (uuid && getDeployedServiceDetailsByIdQuery.data)
        if (
            ![
                ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED,
                ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS,
            ].includes(getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState)
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
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_SUCCESS
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDeployedServiceDetailsByIdQuery.data, OperationType.Destroy),
                uuid,
                'success',
                getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Destroy
            );
        } else if (
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DESTROY_FAILED
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDeployedServiceDetailsByIdQuery.data, OperationType.Destroy),
                uuid,
                'error',
                getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Destroy
            );
        }

    if (getDeployedServiceDetailsByIdQuery.data === undefined) {
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

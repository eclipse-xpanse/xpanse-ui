import { ServiceDetailVo } from '../../../../xpanse-api/generated';
import { OrderSubmitResult } from '../orderStatus/OrderSubmitResult';
import { OrderSubmitFailed } from '../orderStatus/OrderSubmitFailed';
import { ProcessingStatus } from '../orderStatus/ProcessingStatus';
import { OperationType } from '../formElements/CommonTypes';
import { useStopwatch } from 'react-timer-hook';
import React, { useEffect } from 'react';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';

function OrderSubmitStatusPolling({
    uuid,
    error,
    isLoading,
    setIsDeploying,
    setRequestSubmitted,
}: {
    uuid: string | undefined;
    error: Error | undefined;
    isLoading: boolean;
    setIsDeploying: (arg: boolean) => void;
    setRequestSubmitted: (arg: boolean) => void;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(uuid, [
        ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL,
        ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL
        ) {
            setIsDeploying(false);
            setRequestSubmitted(true);
        }
        if (
            getServiceDetailsByIdQuery.data &&
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
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
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (error) {
        return OrderSubmitFailed(
            error,
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (uuid && getServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Deployment status polling failed. Please visit MyServices page to check the status of the request.',
            uuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (
        uuid &&
        getServiceDetailsByIdQuery.data?.serviceDeploymentState === ServiceDetailVo.serviceDeploymentState.DEPLOYING
    ) {
        return OrderSubmitResult(
            'Deploying, Please wait...',
            uuid,
            'success',
            getServiceDetailsByIdQuery.data.serviceDeploymentState,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (uuid !== undefined && getServiceDetailsByIdQuery.data === undefined) {
        return OrderSubmitResult(
            'Request accepted',
            uuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (
        uuid &&
        getServiceDetailsByIdQuery.data &&
        getServiceDetailsByIdQuery.data.serviceDeploymentState !== ServiceDetailVo.serviceDeploymentState.DEPLOYING
    ) {
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_SUCCESSFUL
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
            getServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOYMENT_FAILED
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

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const getDeployedServiceDetailsByIdQuery = useServiceDetailsPollingQuery(uuid!, [
        ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS,
        ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
    ]);

    const stopWatch = useStopwatch({
        autoStart: true,
    });

    useEffect(() => {
        if (
            getDeployedServiceDetailsByIdQuery.data &&
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS
        ) {
            setIsDeploying(false);
            setRequestSubmitted(true);
        }
        if (
            getDeployedServiceDetailsByIdQuery.data &&
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState ===
                ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED
        ) {
            setIsDeploying(false);
            setRequestSubmitted(false);
        }
    }, [getDeployedServiceDetailsByIdQuery.data, setIsDeploying, setRequestSubmitted]);

    useEffect(() => {
        if (error) {
            setIsDeploying(false);
            setRequestSubmitted(false);
        }
    }, [error, setIsDeploying, setRequestSubmitted]);

    useEffect(() => {
        if (getDeployedServiceDetailsByIdQuery.error) {
            setIsDeploying(false);
        }
    }, [getDeployedServiceDetailsByIdQuery.error, setIsDeploying]);

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
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (uuid && getDeployedServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Deployment status polling failed. Please visit MyServices page to check the status of the request.',
            uuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (
        uuid &&
        getDeployedServiceDetailsByIdQuery.data?.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOYING
    ) {
        return OrderSubmitResult(
            'Deploying, Please wait...',
            uuid,
            'success',
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState,
            stopWatch,
            OperationType.Deploy
        );
    }

    if (uuid !== undefined && getDeployedServiceDetailsByIdQuery.data === undefined) {
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
        getDeployedServiceDetailsByIdQuery.data &&
        getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState !==
            ServiceDetailVo.serviceDeploymentState.DEPLOYING
    ) {
        if (
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDeployedServiceDetailsByIdQuery.data, OperationType.Deploy),
                uuid,
                'success',
                getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Deploy
            );
        }
        if (
            getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState ===
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED
        ) {
            return OrderSubmitResult(
                ProcessingStatus(getDeployedServiceDetailsByIdQuery.data, OperationType.Deploy),
                uuid,
                'error',
                getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState,
                stopWatch,
                OperationType.Deploy
            );
        }
    }

    return <></>;
}

export default OrderSubmitStatusPolling;

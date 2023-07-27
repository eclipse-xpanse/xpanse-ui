import { useQuery } from '@tanstack/react-query';
import { ServiceDetailVo, ServiceService } from '../../../xpanse-api/generated';
import { OrderSubmitResult } from './OrderSubmitResult';
import { OrderSubmitFailed } from './OrderSubmitFailed';
import { ProcessingStatus } from './ProcessingStatus';
import { OperationType } from './formElements/CommonTypes';
import { useStopwatch } from 'react-timer-hook';
import { useEffect } from 'react';
import { deploymentStatusPollingInterval } from '../../utils/constants';

function OrderSubmitStatusPolling({
    uuid,
    error,
    isLoading,
    userName,
    setIsDeploying,
    setRequestSubmitted,
}: {
    uuid: string | undefined;
    error: Error | undefined;
    isLoading: boolean;
    userName: string;
    setIsDeploying: (arg: boolean) => void;
    setRequestSubmitted: (arg: boolean) => void;
}): JSX.Element {
    const getDeployedServiceDetailsByIdQuery = useQuery(
        ['getDeployedServiceDetailsById', uuid, userName],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        () => ServiceService.getDeployedServiceDetailsById(uuid!, userName),
        {
            refetchInterval: (data) =>
                data?.serviceDeploymentState !== ServiceDetailVo.serviceDeploymentState.DEPLOYING
                    ? false
                    : deploymentStatusPollingInterval,
            refetchIntervalInBackground: true,
            refetchOnWindowFocus: false,
            enabled: uuid !== undefined,
        }
    );

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
            ![
                ServiceDetailVo.serviceDeploymentState.DEPLOYING,
                ServiceDetailVo.serviceDeploymentState.DEPLOY_SUCCESS,
            ].includes(getDeployedServiceDetailsByIdQuery.data.serviceDeploymentState)
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
            stopWatch
        );
    }

    if (error) {
        return OrderSubmitFailed(error, ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED, stopWatch);
    }

    if (uuid && getDeployedServiceDetailsByIdQuery.error) {
        return OrderSubmitResult(
            'Deployment status polling failed. Please visit MyServices page to check the status of the request.',
            uuid,
            'error',
            ServiceDetailVo.serviceDeploymentState.DEPLOY_FAILED,
            stopWatch
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
            stopWatch
        );
    }

    if (uuid !== undefined && getDeployedServiceDetailsByIdQuery.data === undefined) {
        return OrderSubmitResult(
            'Request accepted',
            uuid,
            'success',
            ServiceDetailVo.serviceDeploymentState.DEPLOYING,
            stopWatch
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
                stopWatch
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
                stopWatch
            );
        }
    }

    return <></>;
}

export default OrderSubmitStatusPolling;

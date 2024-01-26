/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ApiError, Response, DeployedServiceDetails, DeployedService } from '../../../../xpanse-api/generated';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import React, { useEffect } from 'react';
import { Alert } from 'antd';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

function DestroyServiceStatusPolling({
    deployedService,
    isError,
    isSuccess,
    error,
    setIsDestroyingCompleted,
    getDestroyCloseStatus,
    serviceHostingType,
}: {
    deployedService: DeployedService;
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    setIsDestroyingCompleted: (arg: boolean) => void;
    getDestroyCloseStatus: (arg: boolean) => void;
    serviceHostingType: DeployedServiceDetails.serviceHostingType;
}): React.JSX.Element {
    const getServiceDetailsByIdQuery = useServiceDetailsPollingQuery(
        deployedService.id,
        isSuccess,
        serviceHostingType,
        [
            DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED,
            DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL,
        ]
    );

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.isSuccess &&
            [
                DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED,
                DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL,
            ].includes(getServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            deployedService.serviceDeploymentState = getServiceDetailsByIdQuery.data.serviceDeploymentState;
            setIsDestroyingCompleted(true);
        }
    }, [
        getServiceDetailsByIdQuery.isSuccess,
        getServiceDetailsByIdQuery.data,
        setIsDestroyingCompleted,
        deployedService,
    ]);

    useEffect(() => {
        if (isError) {
            setIsDestroyingCompleted(true);
        }
    }, [isError, setIsDestroyingCompleted]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isError) {
            setIsDestroyingCompleted(true);
        }
    }, [getServiceDetailsByIdQuery.isError, setIsDestroyingCompleted]);

    const onClose = () => {
        getDestroyCloseStatus(true);
    };

    if (isError) {
        deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
        if (error instanceof ApiError && error.body && 'details' in error.body) {
            const response: Response = error.body as Response;
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails msg={'Destroy request failed'} uuid={deployedService.id} />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                    />{' '}
                </div>
            );
        }
    }

    if (getServiceDetailsByIdQuery.isError) {
        deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
        if (
            getServiceDetailsByIdQuery.error instanceof ApiError &&
            'details' in getServiceDetailsByIdQuery.error.body
        ) {
            const response: Response = getServiceDetailsByIdQuery.error.body as Response;
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service Destroy Status Failed'}
                                uuid={deployedService.id}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                    />{' '}
                </div>
            );
        }
    }

    if (getServiceDetailsByIdQuery.data !== undefined) {
        if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL.toString()
        ) {
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service destroyed successfully'}
                                uuid={deployedService.id}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (
            getServiceDetailsByIdQuery.data.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED.toString()
        ) {
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={<OrderSubmitResultDetails msg={'Destroy failed'} uuid={deployedService.id} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                    />{' '}
                </div>
            );
        }
    }

    return <></>;
}

export default DestroyServiceStatusPolling;

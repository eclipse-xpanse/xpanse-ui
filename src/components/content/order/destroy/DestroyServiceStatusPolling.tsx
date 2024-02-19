/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ApiError, DeployedService, DeployedServiceDetails, Response } from '../../../../xpanse-api/generated';
import { useServiceDetailsPollingQuery } from '../orderStatus/useServiceDetailsPollingQuery';
import React, { useEffect } from 'react';
import { Alert } from 'antd';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';

function DestroyServiceStatusPolling({
    deployedService,
    isError,
    isSuccess,
    error,
    setIsDestroying,
    closeDestroyResultAlert,
    serviceHostingType,
}: {
    deployedService: DeployedService;
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    setIsDestroying: (arg: boolean) => void;
    closeDestroyResultAlert: (arg: boolean) => void;
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
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    useEffect(() => {
        if (
            getServiceDetailsByIdQuery.isSuccess &&
            [
                DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED,
                DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL,
            ].includes(getServiceDetailsByIdQuery.data.serviceDeploymentState)
        ) {
            deployedService.serviceDeploymentState = getServiceDetailsByIdQuery.data.serviceDeploymentState;
            deployedService.serviceState = getServiceDetailsByIdQuery.data.serviceState;
            setIsDestroying(false);
        }
    }, [getServiceDetailsByIdQuery.isSuccess, getServiceDetailsByIdQuery.data, setIsDestroying, deployedService]);

    useEffect(() => {
        if (isError) {
            setIsDestroying(false);
        }
    }, [isError, setIsDestroying]);

    useEffect(() => {
        if (getServiceDetailsByIdQuery.isError) {
            setIsDestroying(false);
        }
    }, [getServiceDetailsByIdQuery.isError, setIsDestroying]);

    const onClose = () => {
        setIsDestroying(false);
        closeDestroyResultAlert(true);
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
                        action={
                            <>
                                {getOrderableServiceDetails.isSuccess ? (
                                    <ContactDetailsText
                                        serviceProviderContactDetails={
                                            getOrderableServiceDetails.data.serviceProviderContactDetails
                                        }
                                        showFor={ContactDetailsShowType.Order}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        }
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
                        action={
                            <>
                                {getOrderableServiceDetails.isSuccess ? (
                                    <ContactDetailsText
                                        serviceProviderContactDetails={
                                            getOrderableServiceDetails.data.serviceProviderContactDetails
                                        }
                                        showFor={ContactDetailsShowType.Order}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        }
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
                        action={
                            <>
                                {getOrderableServiceDetails.isSuccess ? (
                                    <ContactDetailsText
                                        serviceProviderContactDetails={
                                            getOrderableServiceDetails.data.serviceProviderContactDetails
                                        }
                                        showFor={ContactDetailsShowType.Order}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        }
                    />{' '}
                </div>
            );
        }
    }

    return <></>;
}

export default DestroyServiceStatusPolling;

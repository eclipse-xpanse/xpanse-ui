/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import {
    DeployedService,
    ErrorResponse,
    serviceDeploymentState,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import { useServiceDetailsByServiceIdQuery } from '../../common/queries/useServiceDetailsByServiceIdQuery.ts';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

function DestroyServiceStatusAlert({
    deployedService,
    destroySubmitRequest,
    serviceStateDestroyQueryError,
    serviceStateDestroyQueryData,
    closeDestroyResultAlert,
}: {
    deployedService: DeployedService;
    destroySubmitRequest: UseMutationResult<ServiceOrder, Error, string>;
    serviceStateDestroyQueryError: Error | null;
    serviceStateDestroyQueryData: ServiceOrderStatusUpdate | undefined;
    closeDestroyResultAlert: (arg: boolean) => void;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    const getRecreateDeployServiceDetailsQuery = useServiceDetailsByServiceIdQuery(
        destroySubmitRequest.data?.serviceId ?? '',
        deployedService.serviceHostingType,
        serviceStateDestroyQueryData?.taskStatus
    );

    if (
        serviceStateDestroyQueryData?.isOrderCompleted &&
        getRecreateDeployServiceDetailsQuery.isSuccess &&
        [
            serviceDeploymentState.DESTROY_FAILED.toString(),
            serviceDeploymentState.DESTROY_SUCCESSFUL.toString(),
        ].includes(getRecreateDeployServiceDetailsQuery.data.serviceDeploymentState)
    ) {
        deployedService.serviceDeploymentState = getRecreateDeployServiceDetailsQuery.data.serviceDeploymentState;
        deployedService.serviceState = getRecreateDeployServiceDetailsQuery.data.serviceState;
    }

    const onClose = () => {
        closeDestroyResultAlert(true);
    };

    if (destroySubmitRequest.isError) {
        let errorMessage;
        if (isHandleKnownErrorResponse(destroySubmitRequest.error)) {
            const response: ErrorResponse = destroySubmitRequest.error.body;
            errorMessage = response.details;
        } else {
            errorMessage = destroySubmitRequest.error.message;
        }
        deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_FAILED;
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={
                        <OrderSubmitResultDetails msg={'Destroy request failed'} uuid={deployedService.serviceId} />
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

    if (serviceStateDestroyQueryError !== null) {
        deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_FAILED;
        if (isHandleKnownErrorResponse(serviceStateDestroyQueryError)) {
            const response: ErrorResponse = serviceStateDestroyQueryError.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service Destroy Status Failed'}
                                uuid={deployedService.serviceId}
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

    if (serviceStateDestroyQueryData !== undefined) {
        if (serviceStateDestroyQueryData.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service destroyed successfully'}
                                uuid={deployedService.serviceId}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (serviceStateDestroyQueryData.taskStatus.toString() === taskStatus.FAILED.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={
                            <OrderSubmitResultDetails msg={'Destroy failed'} uuid={deployedService.serviceId} />
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

    return <></>;
}

export default DestroyServiceStatusAlert;

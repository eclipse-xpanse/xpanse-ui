/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../../styles/submit-alert.module.css';
import {
    ApiError,
    DeployedService,
    ErrorResponse,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    serviceState,
    taskStatus,
} from '../../../../../xpanse-api/generated';
import { isErrorResponse } from '../../../common/error/isErrorResponse';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsQuery from '../../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../../orderStatus/OrderSubmitResultDetails';

function StopServiceStatusAlert({
    deployedService,
    serviceStateStopQuery,
    closeStopResultAlert,
    getStopServiceDetailsQuery,
}: {
    deployedService: DeployedService;
    serviceStateStopQuery: UseMutationResult<ServiceOrder, Error, string>;
    closeStopResultAlert: (arg: boolean) => void;
    getStopServiceDetailsQuery: UseQueryResult<ServiceOrderStatusUpdate>;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    const onClose = () => {
        closeStopResultAlert(true);
    };

    if (serviceStateStopQuery.isError) {
        let errorMessage;
        if (
            serviceStateStopQuery.error instanceof ApiError &&
            serviceStateStopQuery.error.body &&
            isErrorResponse(serviceStateStopQuery.error.body)
        ) {
            const response: ErrorResponse = serviceStateStopQuery.error.body;
            errorMessage = response.details;
        } else {
            errorMessage = serviceStateStopQuery.error.message;
        }

        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={
                        <OrderSubmitResultDetails
                            msg={'Service stop request failed'}
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

    if (getStopServiceDetailsQuery.isError) {
        if (
            getStopServiceDetailsQuery.error instanceof ApiError &&
            getStopServiceDetailsQuery.error.body &&
            isErrorResponse(getStopServiceDetailsQuery.error.body)
        ) {
            const response: ErrorResponse = getStopServiceDetailsQuery.error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service Stop Status Failed'}
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

    if (getStopServiceDetailsQuery.isSuccess) {
        if (getStopServiceDetailsQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getStopServiceDetailsQuery.data.taskStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service stopped successfully'}
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
        } else if (getStopServiceDetailsQuery.data.taskStatus.toString() === taskStatus.FAILED.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getStopServiceDetailsQuery.data.taskStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getStopServiceDetailsQuery.data.error &&
                                    Array.isArray(getStopServiceDetailsQuery.data.error.details)
                                        ? getStopServiceDetailsQuery.data.error.details.join(', ')
                                        : 'Stop failed'
                                }
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
        } else if (getStopServiceDetailsQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()) {
            deployedService.serviceState = serviceState.STOPPING;
        }
    }
    return <></>;
}

export default StopServiceStatusAlert;

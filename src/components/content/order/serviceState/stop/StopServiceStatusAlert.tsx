/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../../styles/submit-alert.module.css';
import {
    DeployedService,
    ErrorResponse,
    orderStatus,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    ServiceProviderContactDetails,
    serviceState,
    taskStatus,
} from '../../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import OrderSubmitResultDetails from '../../orderStatus/OrderSubmitResultDetails';

function StopServiceStatusAlert({
    deployedService,
    serviceStateStopQuery,
    closeStopResultAlert,
    getStopServiceDetailsQuery,
    serviceProviderContactDetails,
}: {
    deployedService: DeployedService;
    serviceStateStopQuery: UseMutationResult<ServiceOrder, Error, string>;
    closeStopResultAlert: (arg: boolean) => void;
    getStopServiceDetailsQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const onClose = () => {
        closeStopResultAlert(true);
    };

    if (serviceStateStopQuery.isError) {
        let errorMessage;
        if (isHandleKnownErrorResponse(serviceStateStopQuery.error)) {
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
                            serviceId={deployedService.serviceId}
                        />
                    }
                    showIcon
                    closable={true}
                    onClose={onClose}
                    type={'error'}
                    action={
                        <>
                            {serviceProviderContactDetails ? (
                                <ContactDetailsText
                                    serviceProviderContactDetails={serviceProviderContactDetails}
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
        if (isHandleKnownErrorResponse(getStopServiceDetailsQuery.error)) {
            const response: ErrorResponse = getStopServiceDetailsQuery.error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service Stop Status Failed'}
                                serviceId={deployedService.serviceId}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                        action={
                            <>
                                {serviceProviderContactDetails ? (
                                    <ContactDetailsText
                                        serviceProviderContactDetails={serviceProviderContactDetails}
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
        if (getStopServiceDetailsQuery.data.orderStatus.toString() === orderStatus.SUCCESSFUL.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getStopServiceDetailsQuery.data.orderStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service stopped successfully'}
                                serviceId={deployedService.serviceId}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (getStopServiceDetailsQuery.data.orderStatus.toString() === taskStatus.FAILED.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getStopServiceDetailsQuery.data.orderStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getStopServiceDetailsQuery.data.error &&
                                    Array.isArray(getStopServiceDetailsQuery.data.error.details)
                                        ? getStopServiceDetailsQuery.data.error.details.join(', ')
                                        : 'Stop failed'
                                }
                                serviceId={deployedService.serviceId}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'error'}
                        action={
                            <>
                                {serviceProviderContactDetails ? (
                                    <ContactDetailsText
                                        serviceProviderContactDetails={serviceProviderContactDetails}
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
        } else if (getStopServiceDetailsQuery.data.orderStatus.toString() === orderStatus.IN_PROGRESS.toString()) {
            deployedService.serviceState = serviceState.STOPPING;
        }
    }
    return <></>;
}

export default StopServiceStatusAlert;

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
} from '../../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../../common/error/isHandleKnownErrorResponse.ts';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import OrderSubmitResultDetails from '../../orderStatus/OrderSubmitResultDetails';

function RestartServiceStatusAlert({
    deployedService,
    serviceStateRestartQuery,
    closeRestartResultAlert,
    getRestartServiceDetailsQuery,
    serviceProviderContactDetails,
}: {
    deployedService: DeployedService;
    serviceStateRestartQuery: UseMutationResult<ServiceOrder, Error, string>;
    closeRestartResultAlert: (arg: boolean) => void;
    getRestartServiceDetailsQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const onClose = () => {
        closeRestartResultAlert(true);
    };

    if (serviceStateRestartQuery.isError) {
        let errorMessage;
        if (isHandleKnownErrorResponse(serviceStateRestartQuery.error)) {
            const response: ErrorResponse = serviceStateRestartQuery.error.body;
            errorMessage = response.details;
        } else {
            errorMessage = serviceStateRestartQuery.error.message;
        }
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={
                        <OrderSubmitResultDetails
                            msg={'Restart request failed'}
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

    if (getRestartServiceDetailsQuery.isError) {
        if (isHandleKnownErrorResponse(getRestartServiceDetailsQuery.error)) {
            const response: ErrorResponse = getRestartServiceDetailsQuery.error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service restart Status Failed'}
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

    if (getRestartServiceDetailsQuery.isSuccess) {
        if (getRestartServiceDetailsQuery.data.orderStatus.toString() === orderStatus.SUCCESSFUL.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getRestartServiceDetailsQuery.data.orderStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service restarted successfully'}
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
        } else if (getRestartServiceDetailsQuery.data.orderStatus.toString() === orderStatus.FAILED.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getRestartServiceDetailsQuery.data.orderStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getRestartServiceDetailsQuery.data.error &&
                                    Array.isArray(getRestartServiceDetailsQuery.data.error.details)
                                        ? getRestartServiceDetailsQuery.data.error.details.join(', ')
                                        : 'Restart request failed'
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
        } else if (getRestartServiceDetailsQuery.data.orderStatus.toString() === orderStatus.IN_PROGRESS.toString()) {
            deployedService.serviceState = serviceState.RESTARTING;
        }
    }
    return <></>;
}

export default RestartServiceStatusAlert;

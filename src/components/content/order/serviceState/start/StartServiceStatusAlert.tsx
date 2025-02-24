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

function StartServiceStatusAlert({
    deployedService,
    serviceStateStartQuery,
    closeStartResultAlert,
    getStartServiceDetailsQuery,
    serviceProviderContactDetails,
}: {
    deployedService: DeployedService;
    serviceStateStartQuery: UseMutationResult<ServiceOrder, Error, string>;
    closeStartResultAlert: (arg: boolean) => void;
    getStartServiceDetailsQuery: UseQueryResult<ServiceOrderStatusUpdate>;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const onClose = () => {
        closeStartResultAlert(true);
    };

    if (serviceStateStartQuery.isError) {
        let errorMessage;
        if (isHandleKnownErrorResponse(serviceStateStartQuery.error)) {
            const response: ErrorResponse = serviceStateStartQuery.error.body;
            errorMessage = response.details;
        } else {
            errorMessage = serviceStateStartQuery.error.message;
        }
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={
                        <OrderSubmitResultDetails msg={'Start request failed'} serviceId={deployedService.serviceId} />
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

    if (getStartServiceDetailsQuery.isError) {
        if (isHandleKnownErrorResponse(getStartServiceDetailsQuery.error)) {
            const response: ErrorResponse = getStartServiceDetailsQuery.error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service start Status Failed'}
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

    if (getStartServiceDetailsQuery.isSuccess) {
        if (getStartServiceDetailsQuery.data.orderStatus.toString() === orderStatus.SUCCESSFUL.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getStartServiceDetailsQuery.data.orderStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service started successfully'}
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
        } else if (getStartServiceDetailsQuery.data.orderStatus.toString() === orderStatus.FAILED.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getStartServiceDetailsQuery.data.orderStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getStartServiceDetailsQuery.data.error &&
                                    Array.isArray(getStartServiceDetailsQuery.data.error.details)
                                        ? getStartServiceDetailsQuery.data.error.details.join(', ')
                                        : 'Start failed'
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
        } else if (getStartServiceDetailsQuery.data.orderStatus.toString() === orderStatus.IN_PROGRESS.toString()) {
            deployedService.serviceState = serviceState.STARTING;
        }
    }
    return <></>;
}

export default StartServiceStatusAlert;

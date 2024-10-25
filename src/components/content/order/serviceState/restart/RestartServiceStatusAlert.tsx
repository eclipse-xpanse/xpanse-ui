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
    Response,
    ServiceOrder,
    ServiceOrderStatusUpdate,
    serviceState,
    taskStatus,
} from '../../../../../xpanse-api/generated';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsQuery from '../../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../../orderStatus/OrderSubmitResultDetails';

function RestartServiceStatusAlert({
    deployedService,
    serviceStateRestartQuery,
    closeRestartResultAlert,
    getRestartServiceDetailsQuery,
}: {
    deployedService: DeployedService;
    serviceStateRestartQuery: UseMutationResult<ServiceOrder, Error, string>;
    closeRestartResultAlert: (arg: boolean) => void;
    getRestartServiceDetailsQuery: UseQueryResult<ServiceOrderStatusUpdate>;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    const onClose = () => {
        closeRestartResultAlert(true);
    };

    if (serviceStateRestartQuery.isError) {
        let errorMessage;
        if (
            serviceStateRestartQuery.error instanceof ApiError &&
            serviceStateRestartQuery.error.body &&
            typeof serviceStateRestartQuery.error.body === 'object' &&
            'details' in serviceStateRestartQuery.error.body
        ) {
            const response: Response = serviceStateRestartQuery.error.body as Response;
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
                        <OrderSubmitResultDetails msg={'Restart request failed'} uuid={deployedService.serviceId} />
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

    if (getRestartServiceDetailsQuery.isError) {
        if (
            getRestartServiceDetailsQuery.error instanceof ApiError &&
            getRestartServiceDetailsQuery.error.body &&
            typeof getRestartServiceDetailsQuery.error.body === 'object' &&
            'details' in getRestartServiceDetailsQuery.error.body
        ) {
            const response: Response = getRestartServiceDetailsQuery.error.body as Response;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service restart Status Failed'}
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

    if (getRestartServiceDetailsQuery.isSuccess) {
        if (getRestartServiceDetailsQuery.data.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getRestartServiceDetailsQuery.data.taskStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service restarted successfully'}
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
        } else if (getRestartServiceDetailsQuery.data.taskStatus.toString() === taskStatus.FAILED.toString()) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={getRestartServiceDetailsQuery.data.taskStatus}
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getRestartServiceDetailsQuery.data.errorMsg
                                        ? getRestartServiceDetailsQuery.data.errorMsg.toString()
                                        : 'Restart request failed'
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
        } else if (getRestartServiceDetailsQuery.data.taskStatus.toString() === taskStatus.IN_PROGRESS.toString()) {
            deployedService.serviceState = serviceState.RESTARTING;
        }
    }
    return <></>;
}

export default RestartServiceStatusAlert;

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
    ServiceStateManagementTaskDetails,
    VendorHostedDeployedServiceDetails,
} from '../../../../../xpanse-api/generated';
import { ContactDetailsShowType } from '../../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsQuery from '../../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../../orderStatus/OrderSubmitResultDetails';

function StartServiceStatusAlert({
    deployedService,
    serviceStateStartQuery,

    closeStartResultAlert,
    getStartServiceDetailsQuery,
}: {
    deployedService: DeployedService;
    serviceStateStartQuery: UseMutationResult<string, Error, DeployedService>;
    closeStartResultAlert: (arg: boolean) => void;
    getStartServiceDetailsQuery: UseQueryResult<VendorHostedDeployedServiceDetails>;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    const onClose = () => {
        closeStartResultAlert(true);
    };

    if (serviceStateStartQuery.isError) {
        let errorMessage;
        if (
            serviceStateStartQuery.error instanceof ApiError &&
            serviceStateStartQuery.error.body &&
            'details' in serviceStateStartQuery.error.body
        ) {
            const response: Response = serviceStateStartQuery.error.body as Response;
            errorMessage = response.details;
        } else {
            errorMessage = serviceStateStartQuery.error.message;
        }
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={<OrderSubmitResultDetails msg={'Start request failed'} uuid={deployedService.id} />}
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

    if (getStartServiceDetailsQuery.isError) {
        if (
            getStartServiceDetailsQuery.error instanceof ApiError &&
            'details' in getStartServiceDetailsQuery.error.body
        ) {
            const response: Response = getStartServiceDetailsQuery.error.body as Response;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service start Status Failed'}
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

    if (
        getStartServiceDetailsQuery.isSuccess &&
        getStartServiceDetailsQuery.data.latestRunningManagementTask &&
        getStartServiceDetailsQuery.data.latestRunningManagementTask.taskId === serviceStateStartQuery.data
    ) {
        if (
            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskStatus.toString() ===
            ServiceStateManagementTaskDetails.taskStatus.SUCCESSFUL.toString()
        ) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={
                            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskType +
                            ' ' +
                            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskStatus
                        }
                        description={
                            <OrderSubmitResultDetails msg={'Service started successfully'} uuid={deployedService.id} />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (
            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskStatus.toString() ===
            ServiceStateManagementTaskDetails.taskStatus.FAILED.toString()
        ) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={
                            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskType +
                            ' ' +
                            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskStatus
                        }
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getStartServiceDetailsQuery.data.latestRunningManagementTask.errorMsg
                                        ? getStartServiceDetailsQuery.data.latestRunningManagementTask.errorMsg.toString()
                                        : 'Start failed'
                                }
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
        } else if (
            getStartServiceDetailsQuery.data.latestRunningManagementTask.taskStatus.toString() ===
            ServiceStateManagementTaskDetails.taskStatus.IN_PROGRESS.toString()
        ) {
            deployedService.serviceState = DeployedService.serviceState.STARTING;
        }
    }
    return <></>;
}

export default StartServiceStatusAlert;

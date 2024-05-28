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

function StopServiceStatusAlert({
    deployedService,
    serviceStateStopQuery,
    closeStopResultAlert,
    getStopServiceDetailsQuery,
}: {
    deployedService: DeployedService;
    serviceStateStopQuery: UseMutationResult<string, Error, DeployedService>;
    closeStopResultAlert: (arg: boolean) => void;
    getStopServiceDetailsQuery: UseQueryResult<VendorHostedDeployedServiceDetails>;
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
            'details' in serviceStateStopQuery.error.body
        ) {
            const response: Response = serviceStateStopQuery.error.body as Response;
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
                        <OrderSubmitResultDetails msg={'Service stop request failed'} uuid={deployedService.id} />
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
            'details' in getStopServiceDetailsQuery.error.body
        ) {
            const response: Response = getStopServiceDetailsQuery.error.body as Response;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service Stop Status Failed'}
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
        getStopServiceDetailsQuery.isSuccess &&
        getStopServiceDetailsQuery.data.latestRunningManagementTask &&
        getStopServiceDetailsQuery.data.latestRunningManagementTask.taskId === serviceStateStopQuery.data
    ) {
        if (
            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskStatus.toString() ===
            ServiceStateManagementTaskDetails.taskStatus.SUCCESSFUL.toString()
        ) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={
                            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskType +
                            ' ' +
                            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskStatus
                        }
                        description={
                            <OrderSubmitResultDetails msg={'Service stopped successfully'} uuid={deployedService.id} />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (
            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskStatus.toString() ===
            ServiceStateManagementTaskDetails.taskStatus.FAILED.toString()
        ) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={
                            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskType +
                            ' ' +
                            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskStatus
                        }
                        description={
                            <OrderSubmitResultDetails
                                msg={
                                    getStopServiceDetailsQuery.data.latestRunningManagementTask.errorMsg
                                        ? getStopServiceDetailsQuery.data.latestRunningManagementTask.errorMsg.toString()
                                        : 'Stop failed'
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
            getStopServiceDetailsQuery.data.latestRunningManagementTask.taskStatus.toString() ===
            ServiceStateManagementTaskDetails.taskStatus.IN_PROGRESS.toString()
        ) {
            deployedService.serviceState = DeployedService.serviceState.STOPPING;
        }
    }
    return <></>;
}

export default StopServiceStatusAlert;

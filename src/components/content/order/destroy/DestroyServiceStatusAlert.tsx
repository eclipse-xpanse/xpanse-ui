/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import {
    ApiError,
    DeployedService,
    Response,
    serviceDeploymentState,
    ServiceOrderStatusUpdate,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

function DestroyServiceStatusAlert({
    deployedService,
    destroySubmitError,
    statusPollingError,
    deployedServiceDetails,
    closeDestroyResultAlert,
}: {
    deployedService: DeployedService;
    destroySubmitError: Error | null;
    statusPollingError: Error | null;
    deployedServiceDetails: ServiceOrderStatusUpdate | undefined;
    closeDestroyResultAlert: (arg: boolean) => void;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    const onClose = () => {
        closeDestroyResultAlert(true);
    };

    if (destroySubmitError) {
        let errorMessage;
        if (
            destroySubmitError instanceof ApiError &&
            destroySubmitError.body &&
            typeof destroySubmitError.body === 'object' &&
            'details' in destroySubmitError.body
        ) {
            const response: Response = destroySubmitError.body as Response;
            errorMessage = response.details;
        } else {
            errorMessage = destroySubmitError.message;
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

    if (statusPollingError !== null) {
        deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_FAILED;
        if (
            statusPollingError instanceof ApiError &&
            statusPollingError.body &&
            typeof statusPollingError.body === 'object' &&
            'details' in statusPollingError.body
        ) {
            const response: Response = statusPollingError.body as Response;
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

    if (deployedServiceDetails !== undefined) {
        if (deployedServiceDetails.taskStatus.toString() === taskStatus.SUCCESSFUL.toString()) {
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
        } else if (deployedServiceDetails.taskStatus.toString() === taskStatus.FAILED.toString()) {
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

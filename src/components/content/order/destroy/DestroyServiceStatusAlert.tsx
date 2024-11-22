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
    ErrorResponse,
    serviceDeploymentState,
    ServiceOrderStatusUpdate,
    taskStatus,
} from '../../../../xpanse-api/generated';
import { isErrorResponse } from '../../common/error/isErrorResponse';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

function DestroyServiceStatusAlert({
    deployedService,
    destroySubmitError,
    serviceStateDestroyQueryError,
    serviceStateDestroyQueryData,
    closeDestroyResultAlert,
}: {
    deployedService: DeployedService;
    destroySubmitError: Error | null;
    serviceStateDestroyQueryError: Error | null;
    serviceStateDestroyQueryData: ServiceOrderStatusUpdate | undefined;
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
            isErrorResponse(destroySubmitError.body)
        ) {
            const response: ErrorResponse = destroySubmitError.body;
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

    if (serviceStateDestroyQueryError !== null) {
        deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_FAILED;
        if (
            serviceStateDestroyQueryError instanceof ApiError &&
            serviceStateDestroyQueryError.body &&
            isErrorResponse(serviceStateDestroyQueryError.body)
        ) {
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

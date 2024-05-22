/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ApiError, DeployedService, DeployedServiceDetails, Response } from '../../../../xpanse-api/generated';
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
    deployedServiceDetails: DeployedServiceDetails | undefined;
    closeDestroyResultAlert: (arg: boolean) => void;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);
    if (
        deployedServiceDetails &&
        [
            DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED,
            DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL,
        ].includes(deployedServiceDetails.serviceDeploymentState)
    ) {
        deployedService.serviceDeploymentState = deployedServiceDetails.serviceDeploymentState;
        deployedService.serviceState = deployedServiceDetails.serviceState;
    }

    const onClose = () => {
        closeDestroyResultAlert(true);
    };

    if (destroySubmitError) {
        let errorMessage;
        if (destroySubmitError instanceof ApiError && destroySubmitError.body && 'details' in destroySubmitError.body) {
            const response: Response = destroySubmitError.body as Response;
            errorMessage = response.details;
        } else {
            errorMessage = destroySubmitError.message;
        }
        deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={<OrderSubmitResultDetails msg={'Destroy request failed'} uuid={deployedService.id} />}
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

    if (statusPollingError) {
        deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
        if (statusPollingError instanceof ApiError && 'details' in statusPollingError.body) {
            const response: Response = statusPollingError.body as Response;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Polling Service Destroy Status Failed'}
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

    if (deployedServiceDetails !== undefined) {
        if (
            deployedServiceDetails.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DESTROY_SUCCESSFUL.toString()
        ) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={
                            <OrderSubmitResultDetails
                                msg={'Service destroyed successfully'}
                                uuid={deployedService.id}
                            />
                        }
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
                    />{' '}
                </div>
            );
        } else if (
            deployedServiceDetails.serviceDeploymentState.toString() ===
            DeployedServiceDetails.serviceDeploymentState.DESTROY_FAILED.toString()
        ) {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={'Processing Status'}
                        description={<OrderSubmitResultDetails msg={'Destroy failed'} uuid={deployedService.id} />}
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

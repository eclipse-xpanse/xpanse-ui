/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ApiError, DeployedService, Response } from '../../../../xpanse-api/generated';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import useGetOrderableServiceDetailsQuery from '../../deployedServices/myServices/query/useGetOrderableServiceDetailsQuery';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export function PurgeServiceStatusAlert({
    deployedService,
    purgeSubmitError,
    statusPollingError,
    closePurgeResultAlert,
}: {
    deployedService: DeployedService;
    purgeSubmitError: Error | null;
    statusPollingError: Error | null;
    closePurgeResultAlert: (arg: boolean) => void;
}): React.JSX.Element {
    const getOrderableServiceDetails = useGetOrderableServiceDetailsQuery(deployedService.serviceTemplateId);

    const onClose = () => {
        closePurgeResultAlert(true);
    };

    if (purgeSubmitError) {
        let errorMessage;
        if (purgeSubmitError instanceof ApiError && purgeSubmitError.body && 'details' in purgeSubmitError.body) {
            const response: Response = purgeSubmitError.body as Response;
            errorMessage = response.details;
        } else {
            errorMessage = purgeSubmitError.message;
        }
        deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={errorMessage}
                    description={<OrderSubmitResultDetails msg={'Purge request failed'} uuid={deployedService.id} />}
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

    if (deployedService.id && statusPollingError) {
        if (statusPollingError instanceof ApiError && statusPollingError.body && 'details' in statusPollingError.body) {
            const response: Response = statusPollingError.body as Response;
            if (response.resultType !== Response.resultType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_FAILED;
                return (
                    <div className={submitAlertStyles.submitAlertTip}>
                        {' '}
                        <Alert
                            message={response.details}
                            description={
                                <OrderSubmitResultDetails msg={'Purge request failed'} uuid={deployedService.id} />
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
            } else {
                deployedService.serviceDeploymentState = DeployedService.serviceDeploymentState.DESTROY_SUCCESSFUL;
                return (
                    <div className={submitAlertStyles.submitAlertTip}>
                        {' '}
                        <Alert
                            message={'Processing Status'}
                            description={
                                <OrderSubmitResultDetails
                                    msg={`Service purged successfully`}
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
            }
        }
    }

    return <></>;
}

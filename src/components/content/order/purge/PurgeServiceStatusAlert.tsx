/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import {
    DeployedService,
    ErrorResponse,
    errorType,
    serviceDeploymentState,
    ServiceProviderContactDetails,
} from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList.tsx';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import OrderSubmitResultDetails from '../orderStatus/OrderSubmitResultDetails';

export function PurgeServiceStatusAlert({
    deployedService,
    purgeSubmitError,
    statusPollingError,
    closePurgeResultAlert,
    serviceProviderContactDetails,
}: {
    deployedService: DeployedService;
    purgeSubmitError: Error | null;
    statusPollingError: Error | null;
    closePurgeResultAlert: (arg: boolean) => void;
    serviceProviderContactDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element {
    const onClose = () => {
        closePurgeResultAlert(true);
    };

    function getPurgeSubmissionFailedDisplay(reasons: string[]) {
        return (
            <div>
                <span>{'Purge request failed.'}</span>
                <div>{convertStringArrayToUnorderedList(reasons)}</div>
            </div>
        );
    }

    if (purgeSubmitError) {
        let errorMessage;
        if (isHandleKnownErrorResponse(purgeSubmitError)) {
            const response: ErrorResponse = purgeSubmitError.body;
            errorMessage = getPurgeSubmissionFailedDisplay(response.details);
        } else {
            errorMessage = getPurgeSubmissionFailedDisplay([purgeSubmitError.message]);
        }
        deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_FAILED;
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={'Processing Status'}
                    description={<OrderSubmitResultDetails msg={errorMessage} uuid={deployedService.serviceId} />}
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

    if (deployedService.serviceId && statusPollingError) {
        if (isHandleKnownErrorResponse(statusPollingError)) {
            const response: ErrorResponse = statusPollingError.body;
            if (response.errorType !== errorType.SERVICE_DEPLOYMENT_NOT_FOUND) {
                deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_FAILED;
                return (
                    <div className={submitAlertStyles.submitAlertTip}>
                        {' '}
                        <Alert
                            message={'Processing Status'}
                            description={
                                <OrderSubmitResultDetails
                                    msg={getPurgeSubmissionFailedDisplay(response.details)}
                                    uuid={deployedService.serviceId}
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
            } else {
                deployedService.serviceDeploymentState = serviceDeploymentState.DESTROY_SUCCESSFUL;
                return (
                    <div className={submitAlertStyles.submitAlertTip}>
                        {' '}
                        <Alert
                            message={'Processing Status'}
                            description={
                                <OrderSubmitResultDetails
                                    msg={`Service purged successfully`}
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
            }
        }
    }

    return <></>;
}

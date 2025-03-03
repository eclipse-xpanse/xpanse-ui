/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../../../styles/submit-alert.module.css';
import { ErrorResponse, ServicePolicy } from '../../../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../../../common/error/isHandleKnownErrorResponse.ts';
import ServicePolicySubmitResult from '../ServicePolicySubmitResult';

export default function ServicePolicyUpdateResultStatus({
    isError,
    isSuccess,
    error,
    currentServicePolicy,
}: {
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    currentServicePolicy: ServicePolicy | undefined;
}): React.JSX.Element {
    if (isError) {
        if (isHandleKnownErrorResponse(error)) {
            const response: ErrorResponse = error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.errorType.valueOf()}
                        description={<ServicePolicySubmitResult msg={response.details.toString()} uuid={''} />}
                        showIcon
                        closable={true}
                        type={'error'}
                    />{' '}
                </div>
            );
        } else {
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={'Updating Policy Failed'}
                        description={<ServicePolicySubmitResult msg={error?.message ?? <></>} uuid={''} />}
                        showIcon
                        closable={true}
                        type={'error'}
                    />{' '}
                </div>
            );
        }
    }

    if (isSuccess) {
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={'Policy Process Status'}
                    description={
                        <ServicePolicySubmitResult
                            msg={'Policy updated successfully'}
                            uuid={currentServicePolicy ? currentServicePolicy.servicePolicyId : ''}
                        />
                    }
                    showIcon
                    closable={true}
                    type={'success'}
                />{' '}
            </div>
        );
    }

    return <></>;
}

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../../../styles/submit-alert.module.css';
import { ApiError, Response, ServicePolicy } from '../../../../../../xpanse-api/generated';
import ServicePolicySubmitResult from '../ServicePolicySubmitResult';

export default function ServicePolicyCreateResultStatus({
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
        if (error instanceof ApiError && error.body && 'details' in error.body) {
            const response: Response = error.body as Response;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.resultType.valueOf()}
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
                        message={'Adding Policy Failed'}
                        description={
                            <ServicePolicySubmitResult msg={error?.message ? error.message : <></>} uuid={''} />
                        }
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
                            msg={'Policy created successfully'}
                            uuid={currentServicePolicy === undefined ? '' : currentServicePolicy.servicePolicyId}
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

/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ErrorResponse, UserPolicy } from '../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import UserPolicySubmitResultDetails from '../UserPolicySubmitResultDetails.tsx';

export default function UserPolicyCreateResultStatus({
    isError,
    isSuccess,
    error,
    currentPolicyService,
}: {
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    currentPolicyService: UserPolicy | undefined;
}): React.JSX.Element {
    if (isError) {
        if (isHandleKnownErrorResponse(error)) {
            const response: ErrorResponse = error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={'Policy Process Status'}
                        description={<UserPolicySubmitResultDetails msg={response.details.toString()} uuid={''} />}
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
                        message={'Policy Process Status'}
                        description={
                            <UserPolicySubmitResultDetails msg={error?.message ? error.message : <></>} uuid={''} />
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
                        <UserPolicySubmitResultDetails
                            msg={'Policy created successfully'}
                            uuid={currentPolicyService === undefined ? '' : currentPolicyService.userPolicyId}
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

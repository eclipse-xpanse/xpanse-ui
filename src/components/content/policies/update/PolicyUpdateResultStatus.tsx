/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ApiError, ErrorResponse, UserPolicy } from '../../../../xpanse-api/generated';
import { isErrorResponse } from '../../common/error/isErrorResponse';
import PolicySubmitResultDetails from '../PolicySubmitResultDetails';

export default function PolicyUpdateResultStatus({
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
        if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
            const response: ErrorResponse = error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={<PolicySubmitResultDetails msg={'Policy update request failed'} uuid={''} />}
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
                        message={error?.message}
                        description={<PolicySubmitResultDetails msg={'Policy update request failed'} uuid={''} />}
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
                        <PolicySubmitResultDetails
                            msg={'Policy updated successfully'}
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

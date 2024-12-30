/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ErrorResponse } from '../../../../xpanse-api/generated';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';
import UserPolicySubmitResultDetails from '../UserPolicySubmitResultDetails.tsx';

export default function UserPolicyDeleteResultStatus({
    id,
    isError,
    isSuccess,
    error,
    getDeleteCloseStatus,
}: {
    id: string;
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    getDeleteCloseStatus: (arg: boolean) => void;
}): React.JSX.Element {
    const onClose = () => {
        getDeleteCloseStatus(true);
    };

    if (isError) {
        if (isHandleKnownErrorResponse(error)) {
            const response: ErrorResponse = error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={<UserPolicySubmitResultDetails msg={'Policy delete request failed'} uuid={id} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
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
                        description={<UserPolicySubmitResultDetails msg={'Policy delete request failed'} uuid={id} />}
                        showIcon
                        closable={true}
                        onClose={onClose}
                        type={'success'}
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
                    description={<UserPolicySubmitResultDetails msg={'Policy deleted successfully'} uuid={id} />}
                    showIcon
                    closable={true}
                    onClose={onClose}
                    type={'success'}
                />{' '}
            </div>
        );
    }

    return <></>;
}

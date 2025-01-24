/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../styles/submit-alert.module.css';
import { ErrorResponse } from '../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../utils/generateUnorderedList.tsx';
import { isHandleKnownErrorResponse } from '../common/error/isHandleKnownErrorResponse.ts';

export default function CredentialProcessStatus({
    isError,
    isSuccess,
    successMsg,
    error,
    getCloseStatus,
}: {
    isError: boolean;
    isSuccess: boolean;
    successMsg: string;
    error: Error | null;
    getCloseStatus: (arg: boolean) => void;
}): React.JSX.Element {
    const onClose = () => {
        getCloseStatus(true);
    };

    if (isError) {
        if (isHandleKnownErrorResponse(error)) {
            const response: ErrorResponse = error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.errorType.valueOf()}
                        description={convertStringArrayToUnorderedList(response.details)}
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
                        message={'Credentials Process Status'}
                        description={error?.message}
                        showIcon
                        closable={true}
                        onClose={onClose}
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
                    message={'Credentials Process Status'}
                    description={successMsg}
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

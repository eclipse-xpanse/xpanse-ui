/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ApiError, ErrorResponse } from '../../../../xpanse-api/generated';
import { isErrorResponse } from '../../common/error/isErrorResponse';
import PolicySubmitResultDetails from '../PolicySubmitResultDetails';

export default function PolicyDeleteResultStatus({
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
        if (error instanceof ApiError && error.body && isErrorResponse(error.body)) {
            const response: ErrorResponse = error.body;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.details}
                        description={<PolicySubmitResultDetails msg={'Policy delete request failed'} uuid={id} />}
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
                        description={<PolicySubmitResultDetails msg={'Policy delete request failed'} uuid={id} />}
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
                    description={<PolicySubmitResultDetails msg={'Policy deleted successfully'} uuid={id} />}
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

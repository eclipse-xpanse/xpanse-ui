/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import submitAlertStyles from '../../../../../../styles/submit-alert.module.css';
import { ApiError, Response } from '../../../../../../xpanse-api/generated';
import ServicePolicySubmitResult from '../ServicePolicySubmitResult';

export default function ServicePolicyDeleteStatus({
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
        if (error instanceof ApiError && error.body && typeof error.body === 'object' && 'details' in error.body) {
            const response: Response = error.body as Response;
            return (
                <div className={submitAlertStyles.submitAlertTip}>
                    {' '}
                    <Alert
                        message={response.resultType.valueOf()}
                        description={<ServicePolicySubmitResult msg={response.details.toString()} uuid={id} />}
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
                        message={'Deleting Policy Failed'}
                        description={
                            <ServicePolicySubmitResult msg={error?.message ? error.message : <></>} uuid={id} />
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

    if (isSuccess) {
        return (
            <div className={submitAlertStyles.submitAlertTip}>
                {' '}
                <Alert
                    message={'Policy Process Status'}
                    description={<ServicePolicySubmitResult msg={'Policy deleted successfully'} uuid={id} />}
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

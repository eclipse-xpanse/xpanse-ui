/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert } from 'antd';
import React from 'react';
import { ApiError, Policy, Response } from '../../../../xpanse-api/generated';
import PolicySubmitResultDetails from '../PolicySubmitResultDetails';

export default function PolicyCreateResultStatus({
    isError,
    isSuccess,
    error,
    currentPolicyService,
}: {
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
    currentPolicyService: Policy | undefined;
}): React.JSX.Element {
    if (isError) {
        if (error instanceof ApiError && 'details' in error.body) {
            const response: Response = error.body as Response;
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={'Policy Process Status'}
                        description={<PolicySubmitResultDetails msg={response.details.toString()} uuid={''} />}
                        showIcon
                        closable={true}
                        type={'error'}
                    />{' '}
                </div>
            );
        } else {
            return (
                <div className={'submit-alert-tip'}>
                    {' '}
                    <Alert
                        message={'Policy Process Status'}
                        description={
                            <PolicySubmitResultDetails msg={error?.message ? error.message : <></>} uuid={''} />
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
            <div className={'submit-alert-tip'}>
                {' '}
                <Alert
                    message={'Policy Process Status'}
                    description={
                        <PolicySubmitResultDetails
                            msg={'Policy created successfully'}
                            uuid={currentPolicyService === undefined ? '' : currentPolicyService.id}
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

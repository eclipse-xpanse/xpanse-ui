/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../../../styles/error-alert.module.css';
import { ApiError, Response } from '../../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../../utils/generateUnorderedList';

export function AvailabilityZoneError({
    retryRequest,
    error,
}: {
    retryRequest: () => void;
    error: Error;
}): React.JSX.Element {
    if (error instanceof ApiError && error.body && typeof error.body === 'object' && 'details' in error.body) {
        const response: Response = error.body as Response;
        return (
            <Alert
                message={response.resultType.valueOf()}
                description={convertStringArrayToUnorderedList(response.details)}
                type={'error'}
                closable={false}
                action={
                    <Button
                        className={errorAlertStyles.tryAgainBtnInAlertClass}
                        size='small'
                        type='primary'
                        onClick={retryRequest}
                        danger={true}
                    >
                        Retry Request
                    </Button>
                }
            />
        );
    } else {
        return (
            <Alert
                message='Fetching Availability Regions Failed'
                description={error.message}
                type={'error'}
                closable={false}
                action={
                    <Button
                        className={errorAlertStyles.tryAgainBtnInAlertClass}
                        size='small'
                        type='primary'
                        onClick={retryRequest}
                        danger={true}
                    >
                        Retry Request
                    </Button>
                }
            />
        );
    }
}

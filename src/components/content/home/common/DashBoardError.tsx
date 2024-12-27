/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button, Card } from 'antd';
import React from 'react';
import errorAlertStyles from '../../../../styles/error-alert.module.css';
import { ErrorResponse } from '../../../../xpanse-api/generated';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';
import { isHandleKnownErrorResponse } from '../../common/error/isHandleKnownErrorResponse.ts';

export default function DashBoardError({
    error,
    retryRequest,
}: {
    error: Error | null;
    retryRequest: () => void;
}): React.JSX.Element {
    if (isHandleKnownErrorResponse(error)) {
        const response: ErrorResponse = error.body;
        return (
            <Card title='Services Dashboard' bordered={true}>
                <Alert
                    message={response.errorType.valueOf()}
                    description={convertStringArrayToUnorderedList(response.details)}
                    type={'error'}
                    closable={false}
                    className={errorAlertStyles.errorFailureAlert}
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
            </Card>
        );
    } else {
        return (
            <Card title='Services Dashboard' bordered={true}>
                <Alert
                    message='Fetching Service Details Failed'
                    description={error?.message}
                    type={'error'}
                    closable={false}
                    className={errorAlertStyles.errorFailureAlert}
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
            </Card>
        );
    }
}
